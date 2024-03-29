import { getTokenizationInfo } from "../../../../lib/openai/getNumTokens.js";
import { supabase } from "../../../../lib/supabase.js";

export const chunk = async ({
  numTokensInChunk,
  numTokensInOverlap,
}: {
  numTokensInChunk: number;
  numTokensInOverlap: number;
}) => {
  const { data: filesData } = await supabase
    .from("files")
    .select("id, filename, text");

  if (filesData === null) {
    throw new Error("Not yet handled");
  }

  for (let i = 0; i < filesData.length; i++) {
    const file = filesData[i];
    const words = file.text.split(" ");
    let chunkStart = 0;
    let chunkEnd = 0;

    while (chunkEnd < words.length) {
      chunkEnd += 4;

      const { numTokens } = getTokenizationInfo({
        forModel: "text-embedding-ada-002",
        inText: words.slice(chunkStart, chunkEnd).join(" "),
      });

      if (numTokens > numTokensInChunk) {
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

  const { count: numChunks, error } = await supabase
    .from("chunks")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new Error("Problem getting chunks");
  }

  if (numChunks === null) {
    throw new Error("No chunks found");
  }

  return { numChunks };
};
