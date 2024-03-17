import BotWhatsapp from "@bot-whatsapp/bot";
import { menuFlow } from "./menu.flow";

export const onboardingFlow = BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.ACTION)
  .addAnswer(
    "Cual es tu nombre",
    { capture: true },
    async (ctx, { state, gotoFlow }) => {
      try {
        await state.update({ name: ctx.body });
      } catch (err) {
        console.log(`[ERROR]:`, err);
        return;
      }
    }
  )
  .addAnswer(
    "De que Pais, provincia y ciudad/colonia te comunicas?\nMientrsa mas preciso sea tu informacion mejor ser[a la ayuda que te podremos brindar con nuestros arquitectos mas capacitados.",
    { capture: true },
    async (ctx, { state, gotoFlow }) => {
      try {
        await state.update({ city: ctx.body });
        return gotoFlow(menuFlow);
      } catch (err) {
        console.log(`[ERROR]:`, err);
        return;
      }
    }
  );
