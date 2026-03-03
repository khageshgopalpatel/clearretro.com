import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Configuration
const SITEMAP_PATH = './dist/sitemap.xml'; 
const SERVICE_ACCOUNT_KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';

async function submitSitemap() {
  try {
    console.log('🚀 Starting sitemap submission to Google...');

    // 1. Read and parse sitemap
    console.log(`📖 Reading sitemap from ${SITEMAP_PATH}...`);
    let sitemapContent;
    try {
        sitemapContent = readFileSync(SITEMAP_PATH, 'utf-8');
    } catch (e) {
        console.error(`❌ Error reading sitemap file at ${SITEMAP_PATH}. Make sure you have built the project (npm run build).`);
        process.exit(1);
    }

    const sitemap = await parseStringPromise(sitemapContent);
    const urls = sitemap.urlset.url.map(entry => entry.loc[0]);

    let clientEmail = 'Unknown';
    try {
        const credentials = JSON.parse(readFileSync(SERVICE_ACCOUNT_KEY_FILE, 'utf-8'));
        clientEmail = credentials.client_email;
    } catch (e) {
        // failed to read email, ignore
    }

    if (urls.length === 0) {
      console.log('⚠️ No URLs found in sitemap.');
      return;
    }

    console.log(`🔗 Found ${urls.length} URLs to submit.`);


    // 2. Authenticate
    console.log(`🔑 Authenticating with Google as ${clientEmail}...`);
    console.log(`⚠️  IMPORTANT: Ensure "${clientEmail}" is added as an OWNER in Google Search Console for https://clearretro.com`);
    
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    
    const authClient = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: authClient });

    // 3. Batched Submission
    let successCount = 0;
    let errorCount = 0;

    for (const url of urls) {
      try {
        await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`✅ Submitted: ${url}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed: ${url}`, error.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Submission Complete!`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);

  } catch (error) {
    if (error.message.includes('ENOENT') && error.message.includes(SERVICE_ACCOUNT_KEY_FILE)) {
         console.error(`\n❌ Service Account Key not found at: ${SERVICE_ACCOUNT_KEY_FILE}`);
         console.error('   Please add your Google Cloud Service Account JSON key to the project root as "service-account.json" or set GOOGLE_APPLICATION_CREDENTIALS in .env');
    } else {
        console.error('\n❌ Fatal Error:', error);
    }
    process.exit(1);
  }
}

submitSitemap();
