import axios from "axios";
import { CONFIG } from "src/config/config";
import type { IRemodelaParams } from "./types";
import { remodelaPrompt } from "src/flow/remodela.entities";

const buildRemodelPrompt = (params: IRemodelaParams) => {
  return remodelaPrompt
    .replace("[ROOM]", params.room)
    .replace("[STYLE]", params.style)
    .replace("[COLORS]", params.colors)
    .replace("[extraPrompt]", params.extraPrompt || "Sin extra prompt");
};

/**
 * Model: alaradirik/t2i-adapter-sdxl-depth-midas
 * @param params
 * @returns
 */
export const remodelImageAsync = async (
  params: IRemodelaParams
): Promise<string> => {
  const response = await axios.post(
    "https://api.replicate.com/v1/predictions",
    {
      version:
        "8a89b0ab59a050244a751b6475d91041a8582ba33692ae6fab65e0c51b700328",
      input: {
        image: params.fileUrl,
        prompt: buildRemodelPrompt(params),
        scheduler: "K_EULER_ANCESTRAL",
        num_samples: 1,
        guidance_scale: 7.5,
        negative_prompt:
          "anime, cartoon, graphic, text, painting, crayon, graphite, abstract, glitch, deformed, mutated, ugly, disfigured",
        num_inference_steps: 30,
        adapter_conditioning_scale: 1,
        adapter_conditioning_factor: 1,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${CONFIG.REPLICATE_API_TOKEN}`,
      },
    }
  );
  let generatedImage: string;
  while (!generatedImage) {
    // Loop in 1s intervals until the alt text is ready
    const finalResponse = await axios.get(response.data.urls.get, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${CONFIG.REPLICATE_API_TOKEN}`,
      },
    });

    if (finalResponse.data.status === "succeeded") {
      generatedImage = finalResponse.data.output[1];
    } else if (finalResponse.data.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return generatedImage;
};

export const getImageBufferFromURLAsync = async (
  imageUrl: string
): Promise<Buffer> => {
  try {
    const response = await axios.get(imageUrl, {
      headers: {
        "Content-Type": "image/jpeg",
      },
      responseType: "arraybuffer",
    });
    if (response.data) {
      return Buffer.from(response.data);
    }
    return null;
  } catch (error) {
    console.error(
      "[Replicate][getImageBufferFromURL] Error al descargar la imagen:",
      error
    );
  }
};

