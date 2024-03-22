import { z } from "zod";
import fs from "fs/promises";

const zJsonString = z.string().transform((val, ctx) => {
  try {
    return JSON.parse(val);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid JSON string",
    });

    return z.NEVER;
  }
});

const configSchema = zJsonString.pipe(
  z.object({
    SUPABASE_URL: z.string(),
    SUPABASE_KEY: z.string(),
  }),
);

const configData = await fs.readFile("./config.json", "utf-8");

export const config = configSchema.parse(configData);
