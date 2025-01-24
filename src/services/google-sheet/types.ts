import type { OAuth2Client } from "google-auth-library";

export interface IUser {
  telefono: string;
  nombre: string;
  ubicacion: string;
  cp: string;
}

export interface IRowUser extends IUser {
  ambiente: string;
  estilo: string;
  image_url_prev: string;
  image_url_next: string;
  presupuesto: string;
  like: string;
  agendarVisita: string;
}

export interface IParamsAddRow {
  spreadsheetId: string;
  auth: OAuth2Client;
  sheetName: string;
  values: Array<Array<string>>;
}
