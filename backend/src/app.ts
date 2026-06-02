import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import tokensRoutes from "./routes/tokens";
import paymentsRoutes from "./routes/payments";
import adminRoutes from "./routes/admin";
import categoriesRoutes from "./routes/categories";
import dataRoutes from "./routes/data";
import cronRoutes from "./routes/cron";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    name: "Dream Dubai API",
    status: "running",
    health: "/health",
    docs: "Use /api/* routes",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tokens", tokensRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/cron", cronRoutes);
app.use("/api", dataRoutes);

export default app;
