import BotWhatsapp from "@bot-whatsapp/bot";
import { menuFlow } from "./menu.flow";
import configJson from "src/config/message.config.json";

export const onboardingFlow = BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.ACTION)
  .addAnswer(
    configJson.termsConditions,
    { capture: true },
    async (ctx, { state, gotoFlow, fallBack, endFlow }) => {
      let incomingMessage = ctx.body?.trim().toLowerCase();
      if (["1", "si", "sí"].includes(incomingMessage)) {
        return;
      } else if (["2", "no"].includes(incomingMessage)) {
        return endFlow(configJson.termsConditionsNO);
      } else {
        return fallBack(configJson.remodelFlow.askStyle);
      }
    }
  )
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
      } catch (err) {
        console.log(`[ERROR]:`, err);
        return;
      }
    }
  )
  .addAnswer(
    configJson.askCP,
    { capture: true },
    async (ctx, { state, gotoFlow }) => {
      try {
        await state.update({ cp: ctx.body });
        return gotoFlow(menuFlow);
      } catch (err) {
        console.log(`[ERROR]:`, err);
        return;
      }
    }
  );
