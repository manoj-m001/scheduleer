import 'dotenv/config';
import { google } from 'googleapis';
import oauth2Client from './googleconfig.js';

async function testGoogleCalendar() {
  console.log("Testing Google Calendar API Integration...");
  console.log("Using Refresh Token:", process.env.REFRESH_TOKEN ? "Present" : "Missing");
  
  if (!process.env.REFRESH_TOKEN) {
    console.error("❌ No REFRESH_TOKEN found in .env");
    return;
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const startDateTime = new Date();
    startDateTime.setHours(startDateTime.getHours() + 1); // 1 hour from now
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

    const event = {
      summary: `Test Meeting Integration`,
      description: `Testing Google Meet auto-generation`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: Date.now().toString(),
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    console.log("Sending request to Google Calendar API...");
    const eventResponse = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      resource: event,
    });

    console.log("✅ Success! Event created.");
    console.log("Event Link:", eventResponse.data.htmlLink);
    if (eventResponse.data.hangoutLink) {
        console.log("✅ Google Meet URL successfully generated:", eventResponse.data.hangoutLink);
    } else {
        console.log("❌ Event created, but NO Google Meet URL was generated.");
        console.log("Full response data scope:", JSON.stringify(eventResponse.data, null, 2));
    }
  } catch (error) {
    console.error("❌ Google Calendar API Failed:");
    console.error("Error Message:", error.message);
    if (error.response && error.response.data) {
        console.error("Detailed API Error:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGoogleCalendar();
