const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const crypto = require("crypto");

const db = getFirestore();

// Helper: Post to Slack API
async function slackApi(method, token, body) {
    const res = await fetch(`https://slack.com/api/${method}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });
    return res.json();
}

// Helper: Verify Slack Signature
function verifySlackSignature(req, signingSecret) {
    const signature = req.headers['x-slack-signature'];
    const timestamp = req.headers['x-slack-request-timestamp'];

    if (!signature || !timestamp) {
        return false;
    }

    // Prevent replay attacks (5 minutes tolerance)
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
    if (timestamp < fiveMinutesAgo) {
        return false;
    }

    const sigBasestring = 'v0:' + timestamp + ':' + req.rawBody;
    const mySignature = 'v0=' + crypto.createHmac('sha256', signingSecret)
        .update(sigBasestring, 'utf8')
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(mySignature, 'utf8'),
        Buffer.from(signature, 'utf8')
    );
}

// 1. Slash Command Handler: /clearretro
// 1. Slash Command Handler: /clearretro
exports.slackCommands = onRequest({
    secrets: ["SLACK_SIGNING_SECRET"]
}, async (req, res) => {
    
    // Security Check
    if (!verifySlackSignature(req, process.env.SLACK_SIGNING_SECRET)) {
        return res.status(401).send("Invalid signature");
    }
    
    const { trigger_id, team_id, user_id, text } = req.body;
    
    try {
        const installDoc = await db.collection("slack_installations").doc(team_id).get();
        if (!installDoc.exists) {
            res.send("Clear Retro is not connected. Please ask an admin to install it.");
            return;
        }
        
        const installData = installDoc.data();
        const firebaseUid = installData.installedBy;
        const adminSlackId = installData.slackUserId;
        const authorizedUsers = installData.authorizedUsers || [adminSlackId]; // Admin is always authorized

        // AUTHORIZATION CHECK
        if (!authorizedUsers.includes(user_id)) {
            // Not authorized? Show Request Button
            await slackApi("views.open", installData.accessToken, {
                trigger_id: trigger_id,
                view: {
                    type: "modal",
                    callback_id: "request_access_modal",
                    title: { type: "plain_text", text: "Access Required" },
                    blocks: [
                        {
                            type: "section",
                            text: { type: "mrkdwn", text: "🔒 To use Clear Retro, you need access from the team admin." }
                        },
                        {
                            type: "actions",
                            elements: [
                                {
                                    type: "button",
                                    text: { type: "plain_text", text: "Request Access" },
                                    style: "primary",
                                    action_id: "request_access",
                                    value: adminSlackId // Pass admin ID to find who to ping
                                }
                            ]
                        }
                    ]
                }
            });
            return res.status(200).send();
        }
        
        // Fetch recent boards for this user
        const boardsSnap = await db.collection("boards")
            .where("createdBy", "==", firebaseUid)
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();
            
        const boardOptions = boardsSnap.docs.map(doc => ({
            text: { type: "plain_text", text: doc.data().name || "Untitled Board" },
            value: doc.id
        }));

        if (boardOptions.length === 0) {
             boardOptions.push({
                 text: { type: "plain_text", text: "No boards found" },
                 value: "none"
             });
        }
        
        // Initial Modal (Add Card by default)
        const modal = {
            type: "modal",
            callback_id: "clear_retro_main",
            title: { type: "plain_text", text: "Clear Retro" },
            submit: { type: "plain_text", text: "Add Card" },
            blocks: [
                {
                    type: "section",
                    block_id: "board_select_block",
                    text: { type: "mrkdwn", text: "*Select Board*" },
                    accessory: {
                        type: "static_select",
                        action_id: "board_select",
                        placeholder: { type: "plain_text", text: "Pick a board..." },
                        options: boardOptions
                    }
                },
                {
                    type: "input",
                    block_id: "card_text_block",
                    label: { type: "plain_text", text: "Card Content" },
                    element: {
                        type: "plain_text_input",
                        action_id: "card_text",
                        multiline: true
                    }
                }
            ]
        };
        
        // Open Modal
        const slackRes = await slackApi("views.open", installData.accessToken, {
            trigger_id: trigger_id,
            view: modal
        });

        if (!slackRes.ok) {
            console.error("Slack Views Open Error:", JSON.stringify(slackRes));
        }
        
        res.status(200).send();
        
    } catch (e) {
        console.error("Slack Command Error:", e);
        res.status(500).send("Something went wrong.");
    }
});

// 2. Interaction Handler
exports.slackInteractions = onRequest({
    secrets: ["SLACK_SIGNING_SECRET"]
}, async (req, res) => {
    
    if (!verifySlackSignature(req, process.env.SLACK_SIGNING_SECRET)) {
        return res.status(401).send("Invalid signature");
    }

    let payload;
    try {
        payload = JSON.parse(req.body.payload);
    } catch (e) {
        return res.status(400).send("Invalid payload");
    }

    const { type, view, actions, team, user } = payload;
    
    try {
        const installDoc = await db.collection("slack_installations").doc(team.id).get();
        if (!installDoc.exists) return res.status(404).send();
        const installData = installDoc.data();
        const firebaseUid = installData.installedBy;

        // Handle Block Actions
        if (type === "block_actions") {
            const action = actions[0];
            
            // --- REQUEST ACCESS FLOW ---
            if (action.action_id === "request_access") {
                const adminSlackId = action.value;
                
                // 1. Message to Admin (DM)
                await slackApi("chat.postMessage", installData.accessToken, {
                    channel: adminSlackId,
                    text: `User <@${user.id}> requests access to Clear Retro.`,
                    blocks: [
                        {
                            type: "section",
                            text: { type: "mrkdwn", text: `User <@${user.id}> requests access to Clear Retro.` }
                        },
                        {
                            type: "actions",
                            elements: [
                                {
                                    type: "button",
                                    text: { type: "plain_text", text: "Approve Access" },
                                    style: "primary",
                                    action_id: "approve_user",
                                    value: user.id // Store requester's ID
                                },
                                {
                                    type: "button",
                                    text: { type: "plain_text", text: "Deny" },
                                    style: "danger",
                                    action_id: "deny_user",
                                    value: user.id
                                }
                            ]
                        }
                    ]
                });

                // 2. Update Requester's Modal
                await slackApi("views.update", installData.accessToken, {
                    view_id: view.id,
                    view: {
                        type: "modal",
                        title: { type: "plain_text", text: "Request Sent" },
                        blocks: [
                            {
                                type: "section",
                                text: { type: "mrkdwn", text: "✅ Request sent to the workspace admin. You'll be notified when approved." }
                            }
                        ]
                    }
                });
                return res.status(200).send();
            }

            // --- APPROVE USER FLOW ---
            if (action.action_id === "approve_user") {
                 const requesterId = action.value;
                 
                 // 1. Update DB
                 const FieldValue = require("firebase-admin/firestore").FieldValue;
                 await db.collection("slack_installations").doc(team.id).update({
                     authorizedUsers: FieldValue.arrayUnion(requesterId)
                 });
                 
                 // 2. Notify Requester (DM)
                 await slackApi("chat.postMessage", installData.accessToken, {
                     channel: requesterId,
                     text: "🎉 You have been approved! You can now use `/clearretro`."
                 });
                 
                 // 3. Update Admin Message (Remove buttons)
                 // NOTE: payload.container.message_ts and channel_id are needed for update
                 await slackApi("chat.update", installData.accessToken, {
                     channel: payload.container.channel_id,
                     ts: payload.container.message_ts,
                     text: `✅ Approved access for <@${requesterId}>.`,
                     blocks: [
                         {
                             type: "section",
                             text: { type: "mrkdwn", text: `✅ Approved access for <@${requesterId}>.` }
                         }
                     ]
                 });
                 
                 return res.status(200).send();
            }

            // --- DENY USER FLOW ---
            if (action.action_id === "deny_user") {
                const requesterId = action.value;
                 await slackApi("chat.update", installData.accessToken, {
                     channel: payload.container.channel_id,
                     ts: payload.container.message_ts,
                     text: `❌ Denied access for <@${requesterId}>.`,
                     blocks: [
                         {
                             type: "section",
                             text: { type: "mrkdwn", text: `❌ Denied access for <@${requesterId}>.` }
                         }
                     ]
                 });
                 return res.status(200).send();
            }
            
            // --- BOARD SELECTION FLOW ---
            if (action.action_id === "board_select") {
                const boardId = action.selected_option.value;
                const boardDoc = await db.collection("boards").doc(boardId).get();
                const boardData = boardDoc.data();
                
                const columnOptions = boardData.columns.map(col => ({
                    text: { type: "plain_text", text: col.title },
                    value: col.id
                }));
                
                const updatedView = {
                    type: "modal",
                    callback_id: "clear_retro_main",
                    title: { type: "plain_text", text: "Clear Retro" },
                    submit: { type: "plain_text", text: "Add Card" },
                    private_metadata: boardId,
                    blocks: [
                        {
                            type: "section",
                            text: { type: "mrkdwn", text: `*Board:* ${boardData.name}` }
                        },
                        {
                            type: "input",
                            block_id: "column_select_block",
                            label: { type: "plain_text", text: "Select Column" },
                            element: {
                                type: "static_select",
                                action_id: "column_select",
                                placeholder: { type: "plain_text", text: "Pick a column..." },
                                options: columnOptions,
                                initial_option: columnOptions[0]
                            }
                        },
                        {
                            type: "input",
                            block_id: "card_text_block",
                            label: { type: "plain_text", text: "Card Content" },
                            element: {
                                type: "plain_text_input",
                                action_id: "card_text",
                                multiline: true
                            }
                        }
                    ]
                };
                
                await slackApi("views.update", installData.accessToken, {
                    view_id: view.id,
                    view: updatedView
                });
            }
            return res.status(200).send();
        }

        // Handle Form Submission
        if (type === "view_submission") {
            const values = view.state.values;
            const boardId = view.private_metadata;
            
            const columnId = values.column_select_block?.column_select?.selected_option?.value;
            const text = values.card_text_block?.card_text?.value;
            
            if (!boardId || !columnId || !text) {
                return res.json({
                    response_action: "errors",
                    errors: {
                        "card_text_block": `Missing info. Board: ${!!boardId}, Col: ${!!columnId}, Text: ${!!text}`
                    }
                });
            }
            
            // USE SENDER'S NAME for the card if possible
            // We get 'user.name' (username) or 'user.id'
            // Ideally we'd fetch their real name from Slack API user.info, but username is okay for MVP.
            
            // Add Card
             await db.collection("boards").doc(boardId).collection("cards").add({
                text: text,
                columnId: columnId,
                votes: 0,
                createdBy: firebaseUid,
                creatorName: user.username || "Slack User", // Better than hardcoded
                createdAt: new Date().toISOString(),
                isRevealed: false,
                order: Date.now()
            });
            
            return res.json({ response_action: "clear" });
        }
        
    } catch (e) {
        console.error("Interaction Error:", e);
        return res.status(500).send();
    }
    
    res.status(200).send();
});
