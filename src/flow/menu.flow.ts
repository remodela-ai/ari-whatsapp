import * as BotWhatsapp from "@builderbot/bot";
import { remodelaFlow } from "./remodela.flow";
import configJson from "src/config/message.config";
import { onboardingFlow } from "./onboarding.flow";
import { ideasFlow } from "./ideas.flow";
import { sendMessageToConversationAsync } from "src/services/meetCody";
import { faqFlow } from "./faq.flow";
import type { BaileysProvider } from "@builderbot/provider-baileys";
import { findUserByPhone } from "src/services/firebase";

export const menuFlow = BotWhatsapp.addKeyword<BaileysProvider, BotWhatsapp.MemoryDB>(
  ["menu", ...configJson.keys.menu]
)
  .addAction(async (ctx, { state, gotoFlow, flowDynamic, provider }) => {
    try {
      const myState = state.getMyState();
      if (!myState?.nombre) {
        const user = await findUserByPhone(ctx.from);
        if (user) {
          state.update({ ...user, id: user.id });
        } else {
          return gotoFlow(onboardingFlow);
        }
      }
      return;
    } catch (err) {
      console.log("[ERROR]:", err);
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
    async (ctx, { flowDynamic, state, fallBack, endFlow, gotoFlow }) => {
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
