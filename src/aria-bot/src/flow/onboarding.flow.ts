import BotWhatsapp from "@bot-whatsapp/bot";
import { menuFlow } from "./menu.flow";
import configJson from "src/config/message.config.json";

export const onboardingFlow = BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.ACTION)
  .addAnswer(
    configJson.askName,
    { capture: true },
    async (ctx, { state, gotoFlow }) => {
      try {
        await state.update({ nombre: ctx.body });
      } catch (err) {
        console.log(`[ERROR]:`, err);
        return;
      }
    }
  )
  .addAnswer(
    configJson.askCity,
    { capture: true },
    async (ctx, { state, gotoFlow }) => {
      try {
        await state.update({ ubicacion: ctx.body });
        return gotoFlow(menuFlow);
      } catch (err) {
        console.log(`[ERROR]:`, err);
        return;
      }
    }
  );
