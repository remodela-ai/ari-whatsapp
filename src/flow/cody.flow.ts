import BotWhatsapp from "@builderbot/bot";
import { sendMessageToConversationAsync } from "src/services/meetCody";

export const codyFlow = BotWhatsapp.addKeyword(
  BotWhatsapp.EVENTS.ACTION
).addAction(async (ctx, { state, gotoFlow, flowDynamic, endFlow }) => {
  try {
    const resultText = await sendMessageToConversationAsync(ctx.body, null);
    if (resultText) {
      return await flowDynamic([{ body: resultText }]);
    }
    endFlow();
  } catch (err) {
    console.log("[ERROR]:", err);
    return;
  }
});
