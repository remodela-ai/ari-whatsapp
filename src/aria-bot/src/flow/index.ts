import BotWhatsapp from "@bot-whatsapp/bot";
import remodelaFlow from "./remodela.flow";
import { helloFlow } from "./hello.flow";
import { menuFlow } from "./menu.flow";
import { onboardingFlow } from "./onboarding.flow";
// import paypalFlow from "./paypal.flow";
// import chatbotFlow from "./chatbot.flow";
// import nodeFlow from "./node.flow";

/**
 * Debes de implementasr todos los flujos
 */
export default BotWhatsapp.createFlow([
  remodelaFlow,
  menuFlow,
  onboardingFlow,
  helloFlow,
  //   paypalFlow,
  //   chatbotFlow,
  //   nodeFlow,
]);
