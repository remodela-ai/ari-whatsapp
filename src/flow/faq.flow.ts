import BotWhatsapp from "@builderbot/bot";
import configJson from "src/config/message.config";
import { codyFlow } from "./cody.flow";
/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export const faqFlow = BotWhatsapp.addKeyword(
  BotWhatsapp.EVENTS.ACTION
).addAnswer(
  configJson.faq,
  { capture: true },
  async (ctx, { state, gotoFlow, flowDynamic, provider, endFlow }) => {
    try {
      gotoFlow(codyFlow);
    } catch (err) {
      console.log(`[ERROR]:`, err);
      return;
    }
  }
);
