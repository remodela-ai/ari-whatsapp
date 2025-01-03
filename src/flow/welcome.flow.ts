import BotWhatsapp from "@builderbot/bot";
import { onboardingFlow } from "./onboarding.flow";
import { codyFlow } from "./cody.flow";
import { findUserByPhone } from "src/services/google-sheet/gSheetDB";

/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export const welcomeFlow = BotWhatsapp.addKeyword(
  BotWhatsapp.EVENTS.WELCOME
).addAction(async (ctx, { state, gotoFlow }) => {
  try {
    const myState = state.getMyState();
    console.log(ctx);
    if (!myState?.name) {
      const user = await findUserByPhone(ctx.from);
      if (user) {
        console.log(user);
        await state.update({ ...user });
      } else {
        return gotoFlow(onboardingFlow);
      }
    }
    console.log("got to codyFlow");
    return gotoFlow(codyFlow);
  } catch (err) {
    console.log("[ERROR]:", err);
    return;
  }
});
