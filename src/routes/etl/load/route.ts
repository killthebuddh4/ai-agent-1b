import { z } from "zod";
import { Request, Response } from "express";
import { load } from "./load.js";

const zRequestBody = z.object({
  fromDirectory: z.string(),
  options: z
    .object({
      fileExtsToInclude: z.array(z.string()).optional(),
    })
    .optional(),
});

export const route = async (req: Request, res: Response) => {
  const body = zRequestBody.parse(req.body);

  const result = await load(body);

  console.log(result);

  res.json({ ok: true, data: result });
};
