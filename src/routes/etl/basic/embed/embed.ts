import { openai } from "../../../../lib/openai/openai.js";
import { supabase } from "../../../../lib/supabase.js";
import { getTokenizationInfo } from "../../../../lib/openai/getNumTokens.js";
import { config } from "../../../../lib/config.js";
import { writeFile } from "fs/promises";
export const embed = async () => {
  const { data, error } = await supabase.from("chunks").select("id, text");

  if (error) {
    throw new Error("Problem getting chunks");
  }

  if (data === null) {
    throw new Error("No chunks found");
  }

  const batches: Array<{
    start: number;
    end: number;
    numTokens: number;
  }> = [
    {
      start: 0,
      end: 0,
      numTokens: 0,
    },
  ];

  for (let i = 0; i < data.length; i++) {
    const batch = batches[batches.length - 1];

    const { numTokens } = getTokenizationInfo({
      forModel: "text-embedding-ada-002",
      inText: data[i].text,
    });

    if (batch.numTokens + numTokens > 8192) {
      batches.push({
        start: i,
        end: i,
        numTokens,
      });
    } else {
      batch.end = i;
      batch.numTokens += numTokens;
    }
  }

  const totalTokens = batches.reduce((acc, batch) => acc + batch.numTokens, 0);

  if (totalTokens > 500000) {
    throw new Error("Total tokens exceeds 8192");
  } else {
    console.log("Total tokens: " + totalTokens);
  }

  const responses = await Promise.all(
    batches.map(async (batch) => {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: data
          .slice(batch.start, batch.end + 1)
          .filter((d) => d.text.length > 0)
          .map((d) => d.text),
      });

      return response;
    }),
  );

  const embeddings: Array<{
    chunk: { id: number; text: string };
    embedding: { embedding: Array<number> };
  }> = [];

  for (const response of responses) {
    for (const embedding of response.data) {
      const chunk = data[embedding.index];

      if (chunk === undefined) {
        throw new Error(
          "Chunk not found for embedding response with index " +
            embedding.index,
        );
      }

      embeddings.push({
        chunk,
        embedding,
      });
    }
  }

  await writeFile(
    config.EMBEDDINGS_FILE_PATH,
    JSON.stringify(embeddings, null, 2),
    "utf-8",
  );

  return { numEbmedded: embeddings.length };
};
