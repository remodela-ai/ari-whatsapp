import axios from "axios";
import { CONFIG } from "src/config/config";
export const sendMessageToConversationAsync = async (
  message,
  conversationId
) => {
  if (!conversationId) conversationId = CONFIG.MEETCODY_CONVERSATION_ID;

  try {
    // console.log(message);
    const response = await axios.post(
      `${CONFIG.MEETCODY_URL}/messages`,
      {
        content: message,
        conversation_id: conversationId,
      },
      {
        headers: {
          Authorization: "Bearer " + CONFIG.MEETCODY_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    if (response && response.data && response.data.data) {
      return response.data.data?.content;
    }
  } catch (error) {
    console.error("[SendMessageToConversationAsync] Error > ", error);
    return null;
  }
};
