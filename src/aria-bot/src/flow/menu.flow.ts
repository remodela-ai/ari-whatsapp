import BotWhatsapp from "@bot-whatsapp/bot";

export const menuFlow = BotWhatsapp.addKeyword(
  BotWhatsapp.EVENTS.ACTION
).addAnswer(
  "Que quieres hacer? \n1- *Remodelar*\n2- *Preguntas sobre decoracion*\n3- *Preguntas frecuentes*",
  { capture: true },
  async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
    return flowDynamic([{ body: "OK" }]);
  }
);
