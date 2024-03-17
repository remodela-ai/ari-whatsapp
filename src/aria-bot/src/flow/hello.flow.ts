import BotWhatsapp from "@bot-whatsapp/bot";
import remodelaFlow from "./remodela.flow";

/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export default BotWhatsapp.addKeyword(["hola", "buenas"])
  .addAnswer("Un gusto tenerte de nuevo ¿Como puedo ayudarte el día de hoy 😀?")
  .addAction(async (ctx, { state, gotoFlow }) => {
    try {
      return gotoFlow(remodelaFlow);

      /**..... */
    } catch (err) {
      console.log(`[ERROR]:`, err);
      return;
    }
  });
