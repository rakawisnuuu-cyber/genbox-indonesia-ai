import express from "express";
import { createServer as createViteServer } from "vite";
import { generateImageRouter } from "./routes/generate-image";
import { generateStatusRouter } from "./routes/generate-status";
import { generateCharacterRouter } from "./routes/generate-character";
import { promptRouter } from "./routes/prompt";
import { byokRouter } from "./routes/byok";
import { byokValidateRouter } from "./routes/byok-validate";

const PORT = 5000;

async function start() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  app.use("/api/generate/image", generateImageRouter);
  app.use("/api/generate/character", generateCharacterRouter);
  app.use("/api/generate", generateStatusRouter);
  app.use("/api/prompt", promptRouter);
  app.use("/api/byok/validate", byokValidateRouter);
  app.use("/api/byok", byokRouter);

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "::", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
