import BotWhatsapp from "@bot-whatsapp/bot";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { uploadImageAsync } from "src/services/bytescale";
import { dayjsCustom } from "src/utils/dayjs";
import { roomStyle, roomType } from "./remodela.entities";
import { remodelImageAsync } from "src/services/replicate";
import configJson from "src/config/message.config.json";
import { addRow } from "src/services/google-sheet/gSheetDB";

export const remodelaFlow = BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.ACTION)
  .addAnswer(
    configJson.remodelFlow.askImage,
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
        return fallBack(configJson.remodelFlow.askImage);
      }
    }
  )
  .addAnswer(
    configJson.remodelFlow.askRoom,
    {
      capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      let incomingMessage = ctx.body?.trim().toLowerCase();
      if (incomingMessage) {
        await state.update({
          roomType: incomingMessage,
        });
      } else {
        return fallBack(configJson.remodelFlow.askRoom);
      }
    }
  )
  .addAnswer(
    configJson.remodelFlow.askStyle,
    {
      capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      let incomingMessage = ctx.body?.trim().toLowerCase();
      if (incomingMessage) {
        await state.update({
          roomStyle: incomingMessage,
        });
      } else {
        return fallBack(configJson.remodelFlow.askStyle);
      }
    }
  )
  .addAnswer(
    configJson.remodelFlow.askColor,
    {
      capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      let incomingMessage = ctx.body?.trim().toLowerCase();
      if (incomingMessage) {
        await state.update({
          colors: incomingMessage,
        });
      } else {
        return fallBack(configJson.remodelFlow.askColor);
      }
    }
  )
  .addAction(async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
    flowDynamic(
      "Estoy remodelando tu espacio. Por favor, espera unos segundos mientras se realiza el renderizado. ¡Gracias por tu paciencia! ⏳✨"
    );
    let myState = state.getMyState();
    var response = await remodelImageAsync({
      fileUrl: myState.imageUrl,
      room: myState.roomType,
      style: myState.roomStyle,
      colors: myState.colors,
      extraPrompt: myState.extraPrompt,
    });
    if (response) {
      await state.update({
        image_url_prev: myState.imageUrl,
        image_url_next: response,
      });
      return flowDynamic([
        {
          media: response,
          body: "¡Listo! Aquí está el resultado de la remodelación. ¡Espero que te guste! 🏡✨",
        },
      ]);
    } else {
      return flowDynamic(
        `¡Ups! Parece que ha ocurrido un error inesperado durante el proceso de remodelación. Nuestro equipo técnico ya está trabajando para solucionarlo lo más pronto posible. Te pedimos disculpas por las molestias ocasionadas. Por favor, inténtalo nuevamente más tarde o contáctanos para recibir asistencia personalizada. ¡Gracias por tu comprensión!`
      );
    }
  })
  .addAnswer(
    configJson.remodelFlow.askPresupuesto,
    {
      capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      let incomingMessage = ctx.body?.trim().toLowerCase();
      try {
        let number = parseInt(incomingMessage);
        let presupuesto;
        switch (number) {
          case 1:
            presupuesto = "ENTRE $20000 y $50000 MXN";
            break;
          case 2:
            presupuesto = "ENTRE $50000 y 100000 MXN";
            break;
          case 3:
            presupuesto = "$100000 o MAS";
            break;

          default:
            break;
        }
        if (!presupuesto) throw new Error("presupuesto is not a number!");
        await state.update({
          presupuesto,
        });
        let myState = state.getMyState();
        console.log(myState);
        await addRow({
          telefono: ctx.from,
          ambiente: myState.roomType,
          estilo: myState.roomStyle,
          image_url_prev: myState.image_url_prev,
          image_url_next: myState.image_url_next,
          nombre: myState.nombre,
          ubicacion: myState.ubicacion,
          presupuesto,
        });
        return flowDynamic([{ body: configJson.goodBye }]);
      } catch (error) {
        console.error("Remodela.flow > ", error);
        return fallBack(configJson.remodelFlow.askPresupuesto);
      }
    }
  );
