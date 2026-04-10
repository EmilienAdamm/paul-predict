import Fastify from "fastify";
import cors from "@fastify/cors";

import { env } from "./env.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: [env.FRONTEND_URL],
  });

  app.get("/health", async () => {
    return { ok: true };
  });

  return app;
}
