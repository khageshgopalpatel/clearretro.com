const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { defineSecret } = require("firebase-functions/params");

const db = getFirestore();

// Define secrets (must be set via `firebase functions:secrets:set`)
const SLACK_CLIENT_ID = defineSecret("SLACK_CLIENT_ID");
const SLACK_CLIENT_SECRET = defineSecret("SLACK_CLIENT_SECRET");

/**
 * Handles the OAuth redirect from Slack.
 * Usage: https://us-central1-<project-id>.cloudfunctions.net/slackAuth?code=...&state=...
 */
exports.slackAuth = onRequest({
    secrets: [SLACK_CLIENT_ID, SLACK_CLIENT_SECRET],
}, async (req, res) => {
    const { code, state, error } = req.query; 

    if (error) {
        console.error("Slack OAuth Error:", error);
        return res.status(400).send(`Slack Login Failed: ${error}`);
    }

    if (!code) {
        return res.status(400).send("Missing code parameter.");
    }

    // Exchange code for token
    try {
        const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: SLACK_CLIENT_ID.value(),
                client_secret: SLACK_CLIENT_SECRET.value(),
                code: code.toString(),
                // redirect_uri: we can omit this if configured in Slack App setup, or pass explicitly
            }),
        });

        const data = await tokenResponse.json();

        if (!data.ok) {
            console.error("Slack Token Error:", data.error);
            return res.status(500).send(`Failed to exchange token: ${data.error}`);
        }

        // Store installation in Firestore
        const installationData = {
            teamId: data.team.id,
            teamName: data.team.name,
            accessToken: data.access_token,
            botUserId: data.bot_user_id,
            installedBy: state || data.authed_user.id, // Use Firebase UID from state, or fallback
            slackUserId: data.authed_user.id,
            scopes: data.scope,
            incomingWebhook: data.incoming_webhook || null, // Capture webhook info
            installedAt: new Date().toISOString(),
        };

        await db.collection("slack_installations").doc(data.team.id).set(installationData, { merge: true });

        return res.send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #10b981;">Success!</h1>
                    <p>Clear Retro connected to <strong>${data.team.name}</strong>.</p>
                    <p>Channel: ${(data.incoming_webhook?.channel) || 'Default'}</p>
                    <p>You can close this window now.</p>
                    <script>setTimeout(() => window.close(), 3000);</script>
                </body>
            </html>
        `);

    } catch (e) {
        console.error("Slack Auth Exception:", e);
        return res.status(500).send("Internal Server Error during Slack Auth.");
    }
});

/**
 * Callable function to post a summary to a channel.
 * Expected body: { teamId: string, message: string } (Channel is implied by webhook)
 */
exports.postSummaryToSlack = onRequest({
    cors: true,
}, async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    const { teamId, message } = req.body;

    if (!teamId || !message) {
        return res.status(400).json({ error: "Missing required fields: teamId, message" });
    }

    try {
        const doc = await db.collection("slack_installations").doc(teamId).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Slack team not found." });
        }

        const data = doc.data();
        
        // Use Webhook if available (Simpler for MVP)
        if (data.incomingWebhook?.url) {
            await fetch(data.incomingWebhook.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: message }),
            });
            return res.json({ success: true, method: "webhook" });
        } 
        
        // Fallback to chat.postMessage if no webhook (requires channelId)
        // ... (Omitting complex fallback logic for MVP, assuming webhook scope is requested)
        return res.status(400).json({ error: "No webhook URL found. Please reinstall app with 'incoming-webhook' scope." });

    } catch (e) {
        console.error("Post Summary Error:", e); 
        return res.status(500).json({ error: e.message });
    }
});
