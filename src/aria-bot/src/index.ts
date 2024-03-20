import "dotenv/config";
import BotWhatsapp from "@bot-whatsapp/bot";
import database from "./database";
import provider from "./provider";
import flow from "./flow";
import { initServer } from "./services/http";
import { readSheet } from "./services/google-sheet/test";

/**
 * Funcion principal del bot
 */
const main = async () => {
  const botFLow = BotWhatsapp.addKeyword("hola").addAnswer("Buenas!") as any;
  await readSheet();
  // console.log(botFLow.toJson());
  // console.log({ botFLow });

  const botInstance = await BotWhatsapp.createBot({
    database,
    provider,
    flow,
  });

  initServer(botInstance);
};

main();
