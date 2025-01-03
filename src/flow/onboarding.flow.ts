import BotWhatsapp from "@builderbot/bot";
import configJson from "src/config/message.config";
import { addUserAsync } from "src/services/google-sheet/gSheetDB";
import { remodelaFlow } from "./remodela.flow";

export const onboardingFlow = BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.ACTION)
	.addAnswer(
		configJson.termsConditions,
		{ capture: true },
		async (ctx, { state, gotoFlow, fallBack, endFlow }) => {
			const incomingMessage = ctx.body?.trim().toLowerCase();

			if (["1", "si", "sí"].includes(incomingMessage)) {
				return;
			}

			if (["2", "no"].includes(incomingMessage)) {
				return endFlow(configJson.termsConditionsNO);
			}

			return fallBack(configJson.remodelFlow.askStyle);
		},
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
		},
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
		},
	)
	// .addAnswer(
	//   configJson.askCP,
	//   { capture: true },
	//   async (ctx, { state, gotoFlow }) => {
	//     try {
	//       await state.update({ cp: ctx.body });
	//       return;
	//     } catch (err) {
	//       console.log(`[ERROR]:`, err);
	//       return;
	//     }
	//   }
	// )
	.addAction(async (ctx, { flowDynamic, state, gotoFlow, endFlow }) => {
		try {
			const myState = state.getMyState();

			await addUserAsync({
				telefono: ctx.from,
				nombre: myState.nombre,
				ubicacion: myState.ubicacion,
				cp: myState.cp,
			});

			return gotoFlow(remodelaFlow);
		} catch (error) {
			console.error("Remodela.flow > ", error);
			return endFlow("Ocurrió un erro, por favor volvamos a intentarlo.");
		}
	});
