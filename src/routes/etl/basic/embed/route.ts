import { z } from "zod";
import { Request, Response } from "express";
import { embed } from "./embed.js";

const zRequestBody = z.object({});

export const route = async (req: Request, res: Response) => {
  const body = zRequestBody.parse(req.body);

  const result = await embed();

  res.json({ ok: true, data: result });
};
