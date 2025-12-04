const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const crypto = require("crypto");
const cors = require('cors')({ origin: true });

initializeApp();
const db = getFirestore();
const auth = getAuth();

// Helper to generate hash for caching
function generateCacheKey(data) {
    const str = JSON.stringify(data);
    return crypto.createHash("sha256").update(str).digest("hex");
}

exports.generateBoardSummary = onRequest({
    secrets: ["GEMINI_API_KEY"],
}, async (req, res) => {
    return cors(req, res, async () => {
        // 1. Validate Auth
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

        try {
            await auth.verifyIdToken(idToken);
        } catch (e) {
            console.error("Token verification failed:", e);
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }

        // 2. Parse Data
        const { cards, columns } = req.body;

        if (!cards || !columns) {
            res.status(400).json({ error: "Missing cards or columns data" });
            return;
        }

        try {
            // 3. Check Cache
            const cacheKey = generateCacheKey({ cards, columns });
            const cacheRef = db.collection("ai_cache").doc(cacheKey);
            const cacheDoc = await cacheRef.get();

            if (cacheDoc.exists) {
                console.log("Cache HIT for key:", cacheKey);
                res.status(200).json(cacheDoc.data().result);
                return;
            }

            console.log("Cache MISS for key:", cacheKey);

            // 4. Call AI
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("GEMINI_API_KEY is not set");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro"];

            // Debug: List models if possible (commented out to avoid extra calls, but good for debugging)
            // try {
            //    const modelList = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; // SDK doesn't have easy listModels in this version?
            // } catch(e) {}

            // Prepare prompt
            const cardsByColumn = columns.map((col) => {
                const colCards = cards.filter((c) => c.columnId === col.id);
                return `${col.title}:\n${colCards.map((c) => `- ${c.text} (${c.votes} votes)`).join("\n")}`;
            }).join("\n\n");

            const prompt = `
            You are an agile coach analyzing a retrospective board. Here is the content of the board:

            ${cardsByColumn}

            Please provide a concise summary in the following JSON format:
            {
                "summary": "A brief executive summary of the main themes (max 3 sentences).",
                "sentimentScore": 0, // A score from 1 (Terrible) to 10 (Excellent) representing team morale.
                "sentimentAnalysis": "A brief explanation of the sentiment score.",
                "actionItems": ["Suggested action item 1", "Suggested action item 2"] // 2-3 actionable suggestions based on the 'To Improve' or negative feedback.
            }
            
            Return ONLY the JSON.
            `;

            let lastError = null;
            let resultJSON = null;

            for (const modelName of modelsToTry) {
                try {
                    console.log(`Attempting with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();

                    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
                    resultJSON = JSON.parse(cleanText);
                    break; // Success
                } catch (error) {
                    console.warn(`Failed with model ${modelName}:`, error);
                    lastError = error;
                }
            }

            if (!resultJSON) {
                throw new Error(`All AI models failed. Last error: ${lastError?.message}`);
            }

            // 5. Save to Cache
            try {
                await cacheRef.set({
                    result: resultJSON,
                    timestamp: new Date().toISOString(),
                    originalInputHash: cacheKey,
                });
            } catch (e) {
                console.error("Failed to write to cache:", e);
            }

            res.status(200).json(resultJSON);

        } catch (error) {
            console.error("Error in generateBoardSummary:", error);
            res.status(500).json({ error: error.message });
        }
    });
});
exports.ssr = onRequest({
    region: "us-central1",
    minInstances: 0,
}, async (req, res) => {
    try {
        const { handler } = await import("./server/entry.mjs");
        return handler(req, res);
    } catch (e) {
        console.error("SSR Error:", e);
        res.status(500).send("Internal Server Error");
    }
});
