import BotWhatsapp from "@bot-whatsapp/bot";
import { onboardingFlow } from "./onboarding.flow";
import { menuFlow } from "./menu.flow";

/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export const welcomeFlow = BotWhatsapp.addKeyword(
  BotWhatsapp.EVENTS.WELCOME
).addAction(async (ctx, { state, gotoFlow }) => {
  try {
    let myState = state.getMyState();
    if (!myState?.name) {
      return gotoFlow(onboardingFlow);
    }
    return gotoFlow(menuFlow);
  } catch (err) {
    console.log(`[ERROR]:`, err);
    return;
  }
});
