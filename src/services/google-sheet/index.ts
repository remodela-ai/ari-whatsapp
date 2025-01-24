import { google } from "googleapis";
import type { IParamsAddRow } from "./types";
import type { OAuth2Client } from "google-auth-library";

const sheets = google.sheets("v4");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken as OAuth2Client;
}

export async function getSpreadSheet({ spreadsheetId, auth }) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

export async function getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
  });
  return res;
}
export async function addValuesAsync({
  spreadsheetId,
  auth,
  sheetName,
  values,
}: IParamsAddRow): Promise<boolean> {
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    auth,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });
  return res.status === 200;
}
