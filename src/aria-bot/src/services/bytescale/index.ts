import { UploadManager } from "@bytescale/sdk";
// import fetch from "node-fetch";
import { CONFIG } from "src/config/config";
const fetch = (...args: any) =>
  import("node-fetch").then(({ default: fetch }: any) => fetch(...args));

export const uploadImageAsync = async (image): Promise<string> => {
  const uploadManager = new UploadManager({
    fetchApi: fetch as any, // import nodeFetch from "node-fetch"; // Only required for Node.js. TypeScript: 'nodeFetch as any' may be necessary.
    apiKey: CONFIG.BYTESCALE_PRIVATE_KEY, // Get API keys from: www.bytescale.com
  });

  const response = await uploadManager.upload({
    // Supported types for 'data' field:
    // - String
    // - Blob
    // - Buffer
    // - ReadableStream (Node.js), e.g. fs.createReadStream("file.txt")
    data: image.buffer,

    // Required when: 'data' is a stream.
    // size: 5098,

    // ---------
    // Optional:
    // ---------

    // Required when: 'data' is a stream, buffer, or string.
    mime: image.mimeType,

    // Required when: 'data' is a stream, buffer, or string.
    originalFileName: image.name,

    // Supported when: 'data' is not a stream.
    maxConcurrentUploadParts: 4,

    metadata: {
      // Up to 2KB of arbitrary JSON.
      phoneNumber: image.phoneNumber,
    },

    tags: [
      // Up to 25 tags per file.
      "remodela",
      "bot",
      "aria",
    ],

    path: {
      // See path variables: https://upload.io/docs/path-variables
      folderPath: "/uploads/{UTC_YEAR}/{UTC_MONTH}/{UTC_DAY}",
      fileName: "{UNIQUE_DIGITS_8}{ORIGINAL_FILE_EXT}",
    },

    cancellationToken: {
      // Set to 'true' after invoking 'upload' to cancel the upload.
      isCancelled: false,
    },
  });
  return response.fileUrl;
};
