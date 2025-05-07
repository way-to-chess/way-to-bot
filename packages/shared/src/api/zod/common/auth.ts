import { z } from "zod";

const CommonAuthTgSchema = z
  .object({
    username: z.string(),
    tgId: z.string(),
  })
  .strict();

export type TCommonAuthTg = z.infer<typeof CommonAuthTgSchema>;
