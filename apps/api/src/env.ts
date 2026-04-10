import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  FRONTEND_URL: z.url(),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3001),
});

export const env = envSchema.parse(process.env);
