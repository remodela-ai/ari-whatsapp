import BotWhatsapp from "@bot-whatsapp/bot";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { uploadImageAsync } from "src/services/bytescale";
import { dayjsCustom } from "src/utils/dayjs";
import {
  getImageBufferFromURLAsync,
  remodelImageAsync,
} from "src/services/replicate";
import configJson from "src/config/message.config";
import {
  addRowRemodelaAsync,
  findUserByPhone,
} from "src/services/google-sheet/gSheetDB";
import { onboardingFlow } from "./onboarding.flow";
import { convertirANumero } from "src/utils/utils";

export const remodelaFlow = BotWhatsapp.addKeyword(["Remodela"])
  .addAction(async (ctx, { state, gotoFlow }) => {
    try {
      let myState = state.getMyState();
      console.log(ctx);
      if (!myState?.name) {
        let user = await findUserByPhone(ctx.from);
        if (user) {
          console.log(user);
          await state.update({ ...user });
        } else {
          return gotoFlow(onboardingFlow);
        }
      }
    } catch (err) {
      console.log(`[ERROR]:`, err);
      return;
    }
  })
  .addAnswer(
    configJson.remodelFlow.askImage,
    { capture: true },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      try {
        if (ctx.message.imageMessage) {
          const buffer = await downloadMediaMessage(ctx as any, "buffer", {});
          console.log("buffer > ", buffer);
          console.log("ctx > ", ctx);
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
      } catch (error) {
        flowDynamic([
          { body: "Algo salió mal, ¿podrías enviarme de nuevo la imágen?" },
        ]);
        console.error("[RemodelaFlow] ERROR > ", error);
        return fallBack(configJson.remodelFlow.askImage);
      }
    }
  )
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
      } catch (error) {
        console.error("Remodela.flow > ", error);
        return fallBack(configJson.remodelFlow.askPresupuesto);
      }
    }
  )
  .addAnswer(
    configJson.remodelFlow.askRoom.replace(
      "[roomType]",
      configJson.remodelFlow.roomType
        .map((rt, ix) => `${ix + 1}- ${rt}`)
        .join("\n")
    ),
    {
      capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      try {
        let incomingMessage = ctx.body?.trim().toLowerCase();
        if (incomingMessage) {
          if (
            configJson.remodelFlow.roomType
              .map((rt) => rt.toLowerCase())
              .includes(incomingMessage)
          ) {
            await state.update({
              roomType: incomingMessage,
            });
          } else {
            let index = convertirANumero(incomingMessage);
            if (index && index <= configJson.remodelFlow.roomType.length) {
              incomingMessage = configJson.remodelFlow.roomType[index - 1];
              await state.update({
                roomType: incomingMessage,
              });
            } else throw new Error("No existe la opcion");
          }
        }
      } catch (error) {
        return fallBack(
          configJson.remodelFlow.askRoom.replace(
            "[roomType]",
            configJson.remodelFlow.roomType
              .map((rt, ix) => `${ix + 1}- ${rt}`)
              .join("\n")
          )
        );
      }
    }
  )
  .addAnswer(
    configJson.remodelFlow.askStyle.replace(
      "[roomStyle]",
      configJson.remodelFlow.roomStyle
        .map((rt, ix) => `${ix + 1}- ${rt}`)
        .join("\n")
    ),
    {
      capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      try {
        let incomingMessage = ctx.body?.trim().toLowerCase();
        if (incomingMessage) {
          if (
            configJson.remodelFlow.roomStyle
              .map((rt) => rt.toLowerCase())
              .includes(incomingMessage)
          ) {
            await state.update({
              roomStyle: incomingMessage,
            });
          } else {
            let index = convertirANumero(incomingMessage);
            if (index && index <= configJson.remodelFlow.roomStyle.length) {
              incomingMessage = configJson.remodelFlow.roomStyle[index - 1];
              await state.update({
                roomStyle: incomingMessage,
              });
            } else throw new Error("No existe la opcion");
          }
        }
      } catch (error) {
        return fallBack(
          configJson.remodelFlow.askStyle.replace(
            "[roomStyle]",
            configJson.remodelFlow.roomStyle
              .map((rt, ix) => `${ix + 1}- ${rt}`)
              .join("\n")
          )
        );
      }
    }
  )
  // .addAnswer(
  //   configJson.remodelFlow.askStyle,
  //   {
  //     capture: true,
  //   },
  //   async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
  //     let incomingMessage = ctx.body?.trim().toLowerCase();
  //     if (incomingMessage) {
  //       await state.update({
  //         roomStyle: incomingMessage,
  //       });
  //     } else {
  //       return fallBack(configJson.remodelFlow.askStyle);
  //     }
  //   }
  // )
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
    let imagenObtenida;

    while (!imagenObtenida) {
      remodelImageAsync({
        fileUrl: myState.imageUrl,
        room: myState.roomType,
        style: myState.roomStyle,
        colors: myState.colors,
        extraPrompt: myState.extraPrompt,
      })
        .then((result) => (imagenObtenida = result))
        .catch((e) => {
          console.error("[RemodelaFlow] Error> ", e);
          return endFlow(
            `¡Ups! Parece que ha ocurrido un error inesperado durante el proceso de remodelación. Nuestro equipo técnico ya está trabajando para solucionarlo lo más pronto posible. Te pedimos disculpas por las molestias ocasionadas. Por favor, inténtalo nuevamente más tarde o contáctanos para recibir asistencia personalizada. ¡Gracias por tu comprensión!`
          );
        });

      if (!imagenObtenida) {
        // Espera 30 segundos antes de la siguiente iteración
        await new Promise((resolve) => setTimeout(resolve, 30000));
        await flowDynamic([{ body: "Sigo remodelando tu espacio..." }]);
      }
    }
    if (imagenObtenida) {
      await state.update({
        image_url_prev: myState.imageUrl,
        image_url_next: imagenObtenida,
      });
      return flowDynamic([
        {
          media: imagenObtenida,
          body: "¡Listo! Aquí está el resultado de la remodelación. ¡Espero que te guste! 🏡✨",
        },
      ]);
    }
  })
  .addAnswer(
    configJson.remodelFlow.askAgendarVisita,
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack, endFlow }) => {
      let incomingMessage = ctx.body?.trim().toLowerCase();
      if (["1", "si", "sí"].includes(incomingMessage)) {
        await state.update({
          agendarVisita: "Sí",
        });
        return flowDynamic([
          { body: configJson.remodelFlow.askAgendarVisita_SI },
        ]);
      } else if (["2", "no"].includes(incomingMessage)) {
        await state.update({
          agendarVisita: "No",
        });
        return flowDynamic([
          { body: configJson.remodelFlow.askAgendarVisita_NO },
        ]);
      } else {
        return fallBack(configJson.remodelFlow.askStyle);
      }
    }
  )
  .addAction(async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
    try {
      let myState = state.getMyState();
      console.log(myState);
      const getBufferImage = await getImageBufferFromURLAsync(
        myState.image_url_next
      );
      let imageUrl = await uploadImageAsync({
        buffer: getBufferImage,
        mimeType: "image/jpeg",
        phoneNumber: ctx.from,
        name: `${ctx.from}-${dayjsCustom()
          .tz("America/Mexico_City")
          .format("YYYYMMDD_HHmmss")}.jpeg`,
      });
      await addRowRemodelaAsync({
        telefono: ctx.from,
        ambiente: myState.roomType,
        estilo: myState.roomStyle,
        image_url_prev: myState.image_url_prev,
        image_url_next: imageUrl,
        nombre: myState.nombre,
        ubicacion: myState.ubicacion,
        cp: myState.cp,
        presupuesto: myState.presupuesto,
        agendarVisita: myState.agendarVisita,
        like: myState.like, //No hay flujo para capturar este dato
      });
      return flowDynamic([{ body: configJson.goodBye }]);
    } catch (error) {
      console.error("Remodela.flow > ", error);
      return endFlow("Ocurrió un erro, por favor volvamos a intentarlo.");
    }
  });
