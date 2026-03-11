import 'dotenv/config';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "urn:ietf:wg:oauth:2.0:oob" // Local CLI redirect URI
);

const scopes = [
  'https://www.googleapis.com/auth/calendar.events'
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // Force refresh token generation
  scope: scopes,
});

console.log('==============================================');
console.log('🔗 1. Click this exact URL to authorize your app:');
console.log(url);
console.log('\n2. Once authorized, Google will give you an Authorization Code.');
console.log('3. Run `node exchangeCode.js YOUR_AUTH_CODE` to get your Refresh Token.');
console.log('==============================================');
