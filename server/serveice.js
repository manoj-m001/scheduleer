import { google } from "googleapis";
import serviceAccount from "./service-account.json.json" with { type: "json" };

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/calendar"]
});

const calendar = google.calendar({
  version: "v3",
  auth
});

export {calendar,auth};