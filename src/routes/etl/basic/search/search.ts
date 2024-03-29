import { config } from "../../../../lib/config.js";
import { readFileSync } from "fs";
import { z } from "zod";
import { openai } from "../../../../lib/openai/openai.js";
import e from "express";

const zEmbeddings = z.array(
  z.object({
    chunk: z.object({
      id: z.string(),
      text: z.string(),
    }),
    embedding: z.object({
      embedding: z.array(z.number()),
    }),
  }),
);

const embeddings = zEmbeddings.parse(
  JSON.parse(readFileSync(config.EMBEDDINGS_FILE_PATH, "utf-8")),
);

console.log("LOADED THE EMBEDDINGS");

const dot = ({ a, b }: { a: Array<number>; b: Array<number> }) => {
  return a.reduce((acc, val, i) => acc + val * b[i], 0);
};

export const search = async ({
  text,
  maxDistance,
  limit,
}: {
  text: string;
  maxDistance: number;
  limit: number;
}) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: [text],
  });

  const results: Array<{ text: string; distance: number }> = [];

  for (const embedding of embeddings) {
    const distance = (() => {
      if (embedding.chunk.text.includes(text)) {
        return 0;
      } else {
        return (
          1 -
          dot({
            a: embedding.embedding.embedding,
            b: response.data[0].embedding,
          })
        );
      }
    })();

    if (distance <= maxDistance) {
      results.push({
        text: embedding.chunk.text,
        distance,
      });
    }
  }

  return {
    results: results.sort((a, b) => a.distance - b.distance).slice(0, limit),
  };
};
