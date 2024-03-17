import BotWhatsapp from "@bot-whatsapp/bot";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { uploadImageAsync } from "src/services/bytescale";
import { dayjsCustom } from "src/utils/dayjs";
import { roomStyle, roomType } from "./remodela.entities";
import { remodelImageAsync } from "src/services/replicate";

export default BotWhatsapp.addKeyword(["1", "remodelar", "remodel"])
  .addAnswer(
    "Necesito que me pases la imágen/foto de la habitación que quieres remodelar.",
    { capture: true },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      if (ctx.message.imageMessage) {
        const buffer = await downloadMediaMessage(ctx as any, "buffer", {});
        console.log("buffer", buffer);
        console.log("ctx", ctx);
        var imageUrl = await uploadImageAsync({
          buffer,
          mimeType: ctx.message.imageMessage.mimetype,
          phoneNumber: ctx.from,
          name: `${ctx.from}-${dayjsCustom()
            .tz("America/Mexico_City")
            .format("YYYYMMDD_HHmmss")}.jpeg`,
        });
        console.log("imageUrl", imageUrl);
        await state.update({ imageUrl });
      } else {
        return fallBack(
          "Necesito que me pases la imágen de la habitación que quieres amueblar"
        );
      }
    }
  )
  .addAnswer(
    `¿Cual es el tipo de habitación que quieres remodelar?: \n${roomType
      .map((type) => `*${type}*`)
      .join("\n")}`,
    {
      capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      let incomingMessage = ctx.body?.trim().toLowerCase();
      if (roomType.some((type) => type.toLowerCase() === incomingMessage)) {
        await state.update({
          roomType: roomType.find(
            (type) => type.toLowerCase() === incomingMessage
          ),
        });
      } else {
        return fallBack(
          `¿Cual es el tipo de habitación que quieres remodelar?: \n${roomType
            .map((type) => `*${type}*`)
            .join("\n")}`
        );
      }
    }
  )
  .addAnswer(
    `¿Cual es el estilo que deseas?: \n${roomStyle
      .map((style) => `*${style}*`)
      .join("\n")}`,
    {
      capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      let incomingMessage = ctx.body?.trim().toLowerCase();
      if (roomStyle.some((style) => style.toLowerCase() === incomingMessage)) {
        await state.update({
          roomStyle: roomStyle.find(
            (style) => style.toLowerCase() === incomingMessage
          ),
        });
      } else {
        return fallBack(
          `¿Cual es el estilo que deseas?: \n${roomStyle
            .map((style) => `*${style}*`)
            .join("\n")}`
        );
      }
    }
  )
  .addAction(async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
    flowDynamic(
      "Estoy agregando los muebles a tu espacio. Por favor aguarda unos segundos..."
    );
    let myState = state.getMyState();
    var response = await remodelImageAsync({
      fileUrl: myState.imageUrl,
      room: myState.roomType,
      style: myState.roomStyle,
      colors: [],
      extraPrompt: myState.extraPrompt,
    });
    if (response) {
      return flowDynamic([
        {
          media: response,
          body: " Aquí está el render. Espero que sea lo que tenías en mente. ¿Hay algo más en lo que pueda ayudarte?",
        },
      ]);
    } else {
      return flowDynamic("Error, por favor intantalo de nuevo");
    }
  });
