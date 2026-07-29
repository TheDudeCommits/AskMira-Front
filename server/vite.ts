import express, { type Express } from "express";
import { randomUUID } from "node:crypto";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { rateLimit } from "express-rate-limit";

export function sanitizeLogField(value: string): string {
  return value.replace(
    /[\u0000-\u001f\u007f-\u009f]/g,
    (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(
    JSON.stringify({
      time: formattedTime,
      source: sanitizeLogField(source),
      message: sanitizeLogField(message),
    }),
  );
}

export function createHtmlRequestLimiter(
  options: { windowMs?: number; limit?: number } = {},
) {
  return rateLimit({
    windowMs: options.windowMs ?? 15 * 60 * 1000,
    limit: options.limit ?? 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many page requests. Please try again later.",
  });
}

export async function setupVite(app: Express, server: Server) {
  // Vite and its config are development-only. Load them only when this
  // development path runs so the production server can omit devDependencies.
  const viteConfigModule = "../vite.config";
  const [{ createServer: createViteServer, createLogger }, { default: viteConfig }] =
    await Promise.all([import("vite"), import(viteConfigModule)]);
  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", createHtmlRequestLimiter(), async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${randomUUID()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", createHtmlRequestLimiter(), (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
