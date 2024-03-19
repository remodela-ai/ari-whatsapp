import BotWhatsapp from "@bot-whatsapp/bot";
import { onboardingFlow } from "./onboarding.flow";
import { menuFlow } from "./menu.flow";
import { codyFlow } from "./cody.flow";

/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export const welcomeFlow = BotWhatsapp.addKeyword(
  BotWhatsapp.EVENTS.WELCOME
).addAction(async (ctx, { state, gotoFlow }) => {
  try {
    let myState = state.getMyState();
    console.log(ctx);
    if (!myState?.name) {
      console.log("got to onboardingFlow");
      return gotoFlow(onboardingFlow);
    }
    console.log("got to codyFlow");
    return gotoFlow(codyFlow);
  } catch (err) {
    console.log(`[ERROR]:`, err);
    return;
  }
});
