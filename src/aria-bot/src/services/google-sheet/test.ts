import { addRowRemodelaAsync } from "./gSheetDB";
import { getAuthToken, getSpreadSheet, getSpreadSheetValues } from "./index";
import { CONFIG } from "src/config/config";

export const readSheet = async () => {
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheetValues({
      spreadsheetId: CONFIG.GOOGLE_SHEET.SHEET_ID,
      auth,
      sheetName: "Users",
    });
    console.log(
      "output for getSpreadSheet",
      JSON.stringify(response.data, null, 2)
    );
    addRowRemodelaAsync({
      ambiente: "TEST",
      estilo: "RETRO",
      image_url_prev: "asdfa",
      image_url_next: "asfdas",
      presupuesto: "asdf",
      telefono: "sadf",
      nombre: "asdf",
      ubicacion: "asdf",
      agendarVisita: "test",
      cp: "",
      like: "",
    });
  } catch (error) {
    console.log(error.message, error.stack);
  }
};
