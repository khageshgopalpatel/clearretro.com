import React from 'react';

interface SlackConnectButtonProps {
    user?: { uid: string } | null;
}

const SlackConnectButton: React.FC<SlackConnectButtonProps> = ({ user }) => {
    // TODO: Move to environment variable
    const CLIENT_ID = import.meta.env.PUBLIC_SLACK_CLIENT_ID;
    
    // The redirect URI must match exactly what is configured in the Slack App
    // We point this to our Cloud Function
    const REDIRECT_URI = "https://us-central1-clear-retro-app.cloudfunctions.net/slackAuth"; 
    
    // Scopes needed:
    // - incoming-webhook: to post messages via webhook URL
    // - commands: to add slash commands
    const SCOPES = "incoming-webhook,commands";
    
    const handleConnect = () => {
        if (!CLIENT_ID) {
            alert("Missing PUBLIC_SLACK_CLIENT_ID env variable");
            return;
        }
        
        // Pass Firebase UID as state to associate installation
        const state = user?.uid || '';
        
        const url = `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
        
        // Open in a popup
        window.open(url, "Connect Slack", "width=600,height=700");
    };

    return (
        <button
            onClick={handleConnect}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors text-gray-700 dark:text-gray-200 font-medium text-sm"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.52v-6.314zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.52v2.52h-2.52zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.522 2.521 2.528 2.528 0 0 1-2.522-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.522 2.522v6.312zM15.166 18.956a2.528 2.528 0 0 1 2.522 2.52A2.528 2.528 0 0 1 15.166 24a2.527 2.527 0 0 1-2.522-2.52v-2.52h2.522zM15.166 17.688a2.527 2.527 0 0 1-2.522-2.521 2.527 2.527 0 0 1 2.522-2.521h6.312A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.312z" />
            </svg>
            <span>Add to Slack</span>
        </button>
    );
};

export default SlackConnectButton;
