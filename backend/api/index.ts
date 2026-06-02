import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.json({
    name: "Dream Dubai API",
    status: "running",
    health: "/health",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/debug-load", async (_req, res) => {
  try {
    await import("../src/app");
    res.json({ ok: true, message: "Full app imports successfully" });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

export default app;
