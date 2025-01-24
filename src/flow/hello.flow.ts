import BotWhatsapp from "@builderbot/bot";
import { onboardingFlow } from "./onboarding.flow";
import configJson from "src/config/message.config";
import { findUserByPhone } from "src/services/google-sheet/gSheetDB";
import { remodelaFlow } from "./remodela.flow";
import type { BaileysProvider } from "@builderbot/provider-baileys";
/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export const helloFlow = BotWhatsapp.addKeyword<BaileysProvider, BotWhatsapp.MemoryDB>(
  ["hello", ...configJson.keys.hello]
).addAction(async (ctx, { state, gotoFlow, flowDynamic, endFlow }) => {
  try {
    console.log("hello flow");
    await flowDynamic([
      // { body: configJson.welcome.replace("[name]", ctx.pushName) },
      {
        media: "https://i.ibb.co/1LBXqK6/ARI1-Mesa-de-trabajo-1.png",
        body: configJson.welcome.replace("[name]", ctx.pushName),
      },
      // { body: configJson.nota }
    ]);
    console.log(ctx);
    //--Send sticker 512x512 webp
    // const sock = await provider.getInstance();
    // const msgPoll = {
    //   sticker: {
    //     url: "https://imgbb.host/images/aasgc.webp",
    //   },
    // };
    // await sock.sendMessage(ctx.key.remoteJid, msgPoll);
    // await flowDynamic([{ body: configJson.nota }]);
    const myState = state.getMyState();

    if (!myState?.nombre) {
      const user = await findUserByPhone(ctx.from);
      if (user) {
        console.log(user);
        await state.update({ ...user });
      } else {
        return gotoFlow(onboardingFlow);
      }
    }
    // endFlow();
    return gotoFlow(remodelaFlow);
  } catch (err) {
    console.log("[ERROR]:", err);
    return;
  }
});
