import { Router } from "express";
import { checkAndRunPendingDraws } from "../lib/draw-engine";

const router = Router();

router.get("/run-draws", async (req, res) => {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const results = await checkAndRunPendingDraws();
  return res.json({ success: true, results });
});

export default router;
