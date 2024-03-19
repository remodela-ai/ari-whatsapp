import BotWhatsapp from "@bot-whatsapp/bot";
import { remodelaFlow } from "./remodela.flow";
import configJson from "src/config/message.config.json";

export const menuFlow = BotWhatsapp.addKeyword(
  BotWhatsapp.EVENTS.ACTION
).addAnswer(
  `${configJson.menu.text} \n${configJson.menu.btns
    .map((optText, index) => `*${index + 1}*- ${optText}`)
    .join("\n")}`,
  {
    capture: true,
  },
  async (ctx: any, { flowDynamic, state, fallBack, endFlow, gotoFlow }) => {
    const message = ctx.body?.toLowerCase().trim();
    console.log(message);
    console.log(ctx);
    if (message == "1" || message == "remodelar") {
      return gotoFlow(remodelaFlow);
    }
    return flowDynamic([{ body: "Sigue en desarrollo" }]);
  }
);
