import {auth,calendar} from './serveice.js';


async function createMeeting() {

  const event = {
    summary: "Scheduled Meeting",
    start: {
      dateTime: "2026-03-20T16:30:00",
      timeZone: "Asia/Kolkata"
    },
    end: {
      dateTime: "2026-03-20T17:00:00",
      timeZone: "Asia/Kolkata"
    },
    conferenceData: {
      createRequest: {
        requestId: "scheduler-123",
        conferenceSolutionKey: {
          type: "hangoutsMeet"
        }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1
  });

  console.log("Meet link:", response.data.hangoutLink);
}

createMeeting();