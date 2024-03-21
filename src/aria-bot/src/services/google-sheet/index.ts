import { google } from "googleapis";
import { IParamsAddRow } from "./types";
import { response } from "express";

const sheets = google.sheets("v4");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken;
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
  rowUser,
}: IParamsAddRow): Promise<boolean> {
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    auth: auth as any,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          rowUser.telefono,
          rowUser.nombre,
          rowUser.ubicacion,
          rowUser.cp,
          rowUser.ambiente,
          rowUser.estilo,
          rowUser.image_url_prev,
          rowUser.image_url_next,
          rowUser.presupuesto,
          rowUser.like,
          rowUser.agendarVisita,
        ],
      ],
    },
  });
  return res.status === 200;
}
