import { google } from 'googleapis';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const SERVICE_ACCOUNT_KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';

// Get URL from command line argument
const urlToCheck = process.argv[2];

if (!urlToCheck) {
  console.error('❌ Please provide a URL to check.');
  console.error('Usage: node scripts/check-indexing-status.js <url>');
  process.exit(1);
}

async function checkStatus() {
  try {
    let clientEmail = 'Unknown';
    try {
        const credentials = JSON.parse(readFileSync(SERVICE_ACCOUNT_KEY_FILE, 'utf-8'));
        clientEmail = credentials.client_email;
    } catch (e) {
        // failed to read email, ignore
    }

    console.log(`🔍 Checking status for: ${urlToCheck}`);
    console.log(`🔑 Authenticating as ${clientEmail}...`);

    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const authClient = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: authClient });

    const response = await indexing.urlNotifications.getMetadata({
      url: urlToCheck,
    });

    console.log('\n📄 Indexing Metadata Response:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.latestUpdate) {
        console.log(`\n✅ URL has been submitted.`);
        console.log(`   Type: ${response.data.latestUpdate.type}`);
        console.log(`   Time: ${response.data.latestUpdate.notifyTime}`);
    } else {
        console.log(`\n⚠️  No recent submission updates found for this URL.`);
    }

  } catch (error) {
    if (error.response && error.response.status === 404) {
        console.log(`\n⚠️  Status: 404 (Not Found)`);
        console.log(`\nℹ️  Explanation:`);
        console.log(`   The Google Indexing API returns 404 if it has no *notification history* for this URL.`);
        console.log(`   For general web pages (non-Job/Video), the API often processes the submission (triggering a crawl)`);
        console.log(`   but does not store retrievable metadata. If the submission script said "✅ Submitted",`);
        console.log(`   then Google received the signal.`);
        console.log(`\n   To verify actual indexing, please use the URL Inspection tool in Google Search Console.`);
    } else {
        console.error('\n❌ Error checking status:');
        if (error.response) {
             console.error(`   Status: ${error.response.status}`);
             console.error(`   Message: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
    }
  }
}

checkStatus();
