import axios from "axios";
import { CONFIG } from "src/config/config";
import { IRemodelaParams } from "./types";
import { remodelaPrompt } from "src/flow/remodela.entities";

const buildRemodelPrompt = (params: IRemodelaParams) => {
  return remodelaPrompt
    .replace("[room]", params.room)
    .replace("[style]", params.style)
    .replace(
      "[colors]",
      params.colors.length > 0 ? params.colors.join(",") : "improvisa"
    )
    .replace("[extraPrompt]", params.extraPrompt || "Sin extra prompt");
};

export const remodelImageAsync = async (
  params: IRemodelaParams
): Promise<string> => {
  const response = await axios.post(
    "https://api.replicate.com/v1/predictions",
    {
      version:
        "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
      input: {
        image: params.fileUrl,
        prompt: buildRemodelPrompt(params),
        scale: 9,
        a_prompt:
          "best quality, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, interior design, natural lighting",
        n_prompt:
          "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + CONFIG.REPLICATE_API_TOKEN,
      },
    }
  );
  let generatedImage;
  while (!generatedImage) {
    // Loop in 1s intervals until the alt text is ready
    let finalResponse = await axios.get(response.data.urls.get, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + CONFIG.REPLICATE_API_TOKEN,
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
