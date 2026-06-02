import type { VercelRequest, VercelResponse } from "@vercel/node";

type ExpressHandler = (req: VercelRequest, res: VercelResponse) => unknown;

let app: ExpressHandler | null = null;

async function loadApp(): Promise<ExpressHandler> {
  if (!app) {
    const mod = await import("../src/app");
    app = mod.default as ExpressHandler;
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await loadApp();
    return expressApp(req, res);
  } catch (error) {
    console.error("[api] startup failed", error);
    res.status(500).json({
      error: "API startup failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
