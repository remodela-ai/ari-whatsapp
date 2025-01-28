import "dotenv/config";
import * as BotWhatsapp from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";

import flow from "./flow";
import { createReadStream } from "node:fs";
import { join } from "node:path";
import { CONFIG } from "./config/config";
import { adapterDB } from "./postgres";

/**
 * Funcion principal del bot
 */
const main = async () => {
  const provider = BotWhatsapp.createProvider(BaileysProvider, {
    groupsIgnore: true,
    readStatus: false,
  });

  provider.server.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  });

  provider.server.get("/qr", (req, res) => {
    const valid = req.query.valid === "true";

    if (!valid) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "unauthorized" }));
      return;
    }

    const PATH_QR = join(process.cwd(), 'bot.qr.png');
    const fileStream = createReadStream(PATH_QR);
    res.writeHead(200, { "Content-Type": "image/png" });
    fileStream.pipe(res);
  })

  provider.server.get("/health", (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  });

  const bot = await BotWhatsapp.createBot({
    database: adapterDB,
    provider,
    flow,
  });

  provider.on("message", ({ body, from, name}) => {
		console.log("Message Payload:", { body, from, name });
  });

  bot.on("send_message", ({ answer, from }) => {
		console.log("Send Message Payload:", { answer, from });
  });

  bot.httpServer(+CONFIG.PORT)
};

main();
