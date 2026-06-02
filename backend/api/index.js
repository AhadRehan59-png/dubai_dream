const express = require("express");

const app = express();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({
    name: "Dream Dubai API",
    status: "running",
    message: "Vercel deploy test — full routes loading next",
  });
});

module.exports = app;
