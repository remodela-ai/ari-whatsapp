import axios from "axios";
import { CONFIG } from "src/config/config";

export const sendMessageToConversationAsync = async (
  message,
  conversationId
) => {
  let newConversationId = conversationId;

  if (!newConversationId) {
    newConversationId = CONFIG.MEETCODY_CONVERSATION_ID;
  }

  try {
    // console.log(message);
    const response = await axios.post(
      `${CONFIG.MEETCODY_URL}/messages`,
      {
        content: message,
        conversation_id: newConversationId,
      },
      {
        headers: {
          Authorization: `Bearer ${CONFIG.MEETCODY_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data?.data?.content) {
      return response.data.data.content;
    }
  } catch (error) {
    console.error("[SendMessageToConversationAsync] Error > ", error);
    return null;
  }
};
