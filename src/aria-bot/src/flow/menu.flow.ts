import BotWhatsapp from "@bot-whatsapp/bot";
import { remodelaFlow } from "./remodela.flow";
import configJson from "src/config/message.config";
import { onboardingFlow } from "./onboarding.flow";
import { ideasFlow } from "./ideas.flow";
import { sendMessageToConversationAsync } from "src/services/meetCody";
import { findUserByPhone } from "src/services/google-sheet/gSheetDB";
import { faqFlow } from "./faq.flow";

export const menuFlow = BotWhatsapp.addKeyword(configJson.keys.menu)
  .addAction(async (ctx: any, { state, gotoFlow, flowDynamic, provider }) => {
    try {
      let myState = state.getMyState();
      if (!myState?.nombre) {
        let user = await findUserByPhone(ctx.from);
        if (user) {
          state.update({ ...user });
        } else {
          return gotoFlow(onboardingFlow);
        }
      }
      return;
    } catch (err) {
      console.log(`[ERROR]:`, err);
      return;
    }
  })
  .addAnswer(
    `${configJson.menu.text} \n${configJson.menu.btns
      .map((optText, index) => `*${index + 1}*- ${optText}`)
      .join("\n")}\nEscribe el número que corresponda a tu elección.`,
    {
      capture: true,
    },
    async (ctx: any, { flowDynamic, state, fallBack, endFlow, gotoFlow }) => {
      const message = ctx.body?.toLowerCase().trim();
      console.log(message);
      console.log(ctx);
      if (message == "1" || message == "remodelar") {
        return gotoFlow(remodelaFlow);
      }
      if (
        message == "2" ||
        message == "ideas de decoracion" ||
        message == "ideas de decoración" ||
        message == "ideas"
      ) {
        return gotoFlow(ideasFlow);
      }
      if (message == "3" || message == "preguntas" || message == "pregunta") {
        return gotoFlow(faqFlow);
      }
      const resultText = await sendMessageToConversationAsync(ctx.body, null);
      if (resultText) {
        return await flowDynamic([{ body: resultText }]);
      }
      endFlow();
      return flowDynamic([{ body: "Sigue en desarrollo" }]);
    }
  );
