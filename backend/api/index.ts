import type { VercelRequest, VercelResponse } from "@vercel/node";

type ExpressApp = (req: VercelRequest, res: VercelResponse) => unknown;

let app: ExpressApp | null = null;

function loadApp(): ExpressApp {
  if (!app) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    app = require("../src/app").default as ExpressApp;
  }
  return app;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return loadApp()(req, res);
  } catch (error) {
    console.error("[api] startup failed", error);
    res.status(500).json({
      error: "API startup failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
