import BotWhatsapp from "@bot-whatsapp/bot";
import { onboardingFlow } from "./onboarding.flow";
import { menuFlow } from "./menu.flow";
import configJson from "src/config/message.config.json";
/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export const helloFlow = BotWhatsapp.addKeyword(
  configJson.keys.hello
).addAction(async (ctx: any, { state, gotoFlow, flowDynamic, provider }) => {
  try {
    await flowDynamic([
      { body: configJson.welcome.replace("[name]", ctx.pushName) },
    ]);
    console.log(ctx);
    //--Send sticker 512x512 webp
    const sock = await provider.getInstance();
    const msgPoll = {
      sticker: {
        url: "https://imgbb.host/images/aasgc.webp",
      },
    };
    await sock.sendMessage(ctx.key.remoteJid, msgPoll);

    await flowDynamic([{ body: configJson.nota }]);
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
