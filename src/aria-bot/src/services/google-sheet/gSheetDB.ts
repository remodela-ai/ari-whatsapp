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
const getSheetAsync = async () => {
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheetValues({
      spreadsheetId: CONFIG.GOOGLE_SHEET.SHEET_ID,
      auth,
      sheetName: "Users",
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
  const values = await getSheetAsync();
  if (values) {
    const find = values.find((r, i) => r[ROW_ID.telefono] === phoneNumber);
    return find && buildUser(find);
  }
  return null;
};

export const addRow = async (row: IRowUser): Promise<boolean> => {
  const auth = await getAuthToken();
  return await addValuesAsync({
    spreadsheetId: CONFIG.GOOGLE_SHEET.SHEET_ID,
    auth,
    sheetName: "Users",
    rowUser: row,
  });
};
