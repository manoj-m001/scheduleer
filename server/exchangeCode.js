import 'dotenv/config';
import { google } from 'googleapis';

const args = process.argv.slice(2);
const code = args[0];

if (!code) {
  console.error("❌ Please provide the authorization code. Example: node exchangeCode.js 4/0AfrIep...");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "urn:ietf:wg:oauth:2.0:oob" // Must match the redirect URI used to generate the URL
);

async function exchangeCode() {
  try {
    console.log("Exchanging code for tokens...");
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n✅ Success! Here is your Refresh Token:');
    console.log('----------------------------------------------------');
    console.log(tokens.refresh_token);
    console.log('----------------------------------------------------');
    console.log('Copy the above token and paste it into your .env file as REFRESH_TOKEN=...');
    
  } catch (err) {
    console.error("❌ Error exchanging code:", err.message);
    if(err.response && err.response.data) {
        console.error("Details:", err.response.data);
    }
  }
}

exchangeCode();
