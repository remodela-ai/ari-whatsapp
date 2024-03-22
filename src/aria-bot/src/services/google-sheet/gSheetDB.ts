import { CONFIG } from "src/config/config";
import { addValuesAsync, getAuthToken, getSpreadSheetValues } from ".";
import { IRowUser, IUser } from "./types";
const ROW_ID = {
  telefono: 0,
  nombre: 1,
  ubicacion: 2,
  cp: 3,
  ambiente: 4,
  estilo: 5,
  image_url_prev: 6,
  image_url_next: 7,
  presupuesto: 8,
  like: 9,
  agendarVisita: 10,
};
const getSheetAsync = async (sheetName: string) => {
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheetValues({
      spreadsheetId: CONFIG.GOOGLE_SHEET.SHEET_ID,
      auth,
      sheetName,
    });
    return response.data.values;
  } catch (error) {
    console.log(error.message, error.stack);
  }
};

export const buildUser = (row: Array<string>): IUser => {
  return {
    nombre: row[ROW_ID.nombre],
    telefono: row[ROW_ID.telefono],
    ubicacion: row[ROW_ID.ubicacion],
    cp: row[ROW_ID.cp],
  };
};

export const findUserByPhone = async (phoneNumber: string): Promise<IUser> => {
  const values = await getSheetAsync("Users");
  if (values) {
    const find = values.find((r, i) => r[ROW_ID.telefono] === phoneNumber);
    return find && buildUser(find);
  }
  return null;
};

export const addRowRemodelaAsync = async (row: IRowUser): Promise<boolean> => {
  const auth = await getAuthToken();
  return await addValuesAsync({
    spreadsheetId: CONFIG.GOOGLE_SHEET.SHEET_ID,
    auth,
    sheetName: "Remodela",
    values: [
      [
        row.telefono,
        row.nombre,
        row.ubicacion,
        row.cp,
        row.ambiente,
        row.estilo,
        row.image_url_prev,
        row.image_url_next,
        row.presupuesto,
        row.like,
        row.agendarVisita,
      ],
    ],
  });
};

export const addUserAsync = async (user: IUser): Promise<boolean> => {
  const auth = await getAuthToken();
  return await addValuesAsync({
    spreadsheetId: CONFIG.GOOGLE_SHEET.SHEET_ID,
    auth,
    sheetName: "Users",
    values: [[user.telefono, user.nombre, user.ubicacion, user.cp]],
  });
};
