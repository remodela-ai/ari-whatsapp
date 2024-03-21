import { Compute } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

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
  auth: JSONClient | Compute;
  sheetName: string;
  rowUser: IRowUser;
}
