import BotWhatsapp from "@bot-whatsapp/bot";
import { onboardingFlow } from "./onboarding.flow";
import { menuFlow } from "./menu.flow";
import configJson from "src/config/message.config.json";
import { sendMessageToConversationAsync } from "src/services/meetCody";
import { codyFlow } from "./cody.flow";
/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export const faqFlow = BotWhatsapp.addKeyword(
  BotWhatsapp.EVENTS.ACTION
).addAnswer(
  configJson.faq,
  { capture: true },
  async (ctx: any, { state, gotoFlow, flowDynamic, provider, endFlow }) => {
    try {
      gotoFlow(codyFlow);
    } catch (err) {
      console.log(`[ERROR]:`, err);
      return;
    }
  }
);
