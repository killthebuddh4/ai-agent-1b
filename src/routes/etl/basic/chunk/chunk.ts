import { getTokenizationInfo } from "../../../../lib/openai/getNumTokens.js";
import { supabase } from "../../../../lib/supabase.js";

export const chunk = async ({
  numTokensInChunk,
  numTokensInOverlap,
}: {
  numTokensInChunk: number;
  numTokensInOverlap: number;
}) => {
  const { data } = await supabase.from("files").select("id, filename, text");

  if (data === null) {
    throw new Error("Not yet handled");
  }

  for (let i = 0; i < data.length; i++) {
    const file = data[i];
    const words = file.text.split(" ");
    let chunkStart = 0;
    let chunkEnd = 0;

    while (chunkEnd < words.length) {
      chunkEnd += 4;

      const tokenInfo = getTokenizationInfo({
        forModel: "text-embedding-ada-002",
        inText: words.slice(chunkStart, chunkEnd).join(" "),
      });

      if (tokenInfo.numTokens > numTokensInChunk) {
        const result = await supabase.from("chunks").insert({
          file: file.id,
          chunk_start: chunkStart,
          chunk_end: chunkEnd - 1,
          text: words.slice(chunkStart, chunkEnd - 1).join(" "),
        });

        if (result.error) {
          throw new Error("Problem inserting chunk");
        }

        chunkStart = chunkEnd - numTokensInOverlap;
      }
    }

    const result = await supabase.from("chunks").insert({
      file: file.id,
      chunk_start: chunkStart,
      chunk_end: chunkEnd - 1,
      text: words.slice(chunkStart, chunkEnd - 1).join(" "),
    });

    if (result.error) {
      throw new Error("Problem inserting chunk");
    }
  }
};
