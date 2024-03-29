import { z } from "zod";
import { Request, Response } from "express";
import { search } from "./search.js";

const zQuery = z.object({
  text: z.string(),
  maxDistance: z.coerce.number().min(0).max(1),
  limit: z.coerce.number().max(20).default(5),
});

export const route = async (req: Request, res: Response) => {
  const query = zQuery.parse(req.query);

  const result = await search(query);

  res.json({ ok: true, data: result });
};
