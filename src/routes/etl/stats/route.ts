import { Request, Response } from "express";
import { stats } from "./stats.js";

export const route = async (req: Request, res: Response) => {
  const result = await stats();

  res.json({ ok: true, data: result });
};
