import { z } from "zod";
import { Request, Response } from "express";
import { chunk } from "./chunk.js";

const zRequestBody = z.object({
  numTokensInChunk: z.number().int().positive(),
  numTokensInOverlap: z.number().int().positive(),
});

export const route = async (req: Request, res: Response) => {
  const body = zRequestBody.parse(req.body);

  const result = await chunk(body);

  res.json({ ok: true, data: result });
};
