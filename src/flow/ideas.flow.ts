import BotWhatsapp from "@builderbot/bot";
import { codyFlow } from "./cody.flow";
import type { BaileysProvider } from "@builderbot/provider-baileys";
/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export const ideasFlow = BotWhatsapp.addKeyword<BaileysProvider, BotWhatsapp.MemoryDB>(
  BotWhatsapp.EVENTS.ACTION
).addAnswer(
  "Por favor, cuéntame qué tipo de ideas o consejos estás buscando. ¡Estoy emocionada por inspirarte! 🏡💡",
  { capture: true },
  async (ctx, { state, gotoFlow, flowDynamic, provider, endFlow }) => {
    try {
      gotoFlow(codyFlow);
    } catch (err) {
      console.log("[ERROR]:", err);
      return;
    }
  }
);
