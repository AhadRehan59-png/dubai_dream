import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../lib/auth";
import { generateCampaignCode } from "../lib/utils";
import { conductDraw } from "../lib/draw-engine";

const router = Router();

const drawSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  prizeValue: z.coerce.number().positive(),
  tokenPrice: z.coerce.number().positive(),
  totalTokens: z.coerce.number().int().positive(),
  imageUrl: z.string().url(),
  categoryId: z.string(),
  badge: z.string().optional(),
  ticketMultiplier: z.coerce.number().int().min(1).default(1),
  drawDays: z.coerce.number().int().min(1).default(7),
});

router.post("/draws", async (req, res) => {
  try {
    await requireAdmin(req);
    const data = drawSchema.parse(req.body);

    const now = new Date();
    const endDate = new Date(now.getTime() + data.drawDays * 24 * 60 * 60 * 1000);
    const drawDate = new Date(endDate);

    let campaignCode = generateCampaignCode();
    let exists = await prisma.draw.findUnique({ where: { campaignCode } });
    while (exists) {
      campaignCode = generateCampaignCode();
      exists = await prisma.draw.findUnique({ where: { campaignCode } });
    }

    const draw = await prisma.draw.create({
      data: {
        campaignCode,
        title: data.title,
        description: data.description,
        prizeValue: data.prizeValue,
        tokenPrice: data.tokenPrice,
        totalTokens: data.totalTokens,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        badge: data.badge || null,
        ticketMultiplier: data.ticketMultiplier,
        drawDate,
        endDate,
      },
    });

    return res.json({ success: true, draw });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input" });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return res.status(403).json({ error: "Forbidden" });
    }
    return res.status(500).json({ error: "Failed to create draw" });
  }
});

router.post("/draws/:id/conduct", async (req, res) => {
  try {
    await requireAdmin(req);
    const result = await conductDraw(req.params.id);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontendUrl}/admin?draw=completed`);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.status(500).json({ error: "Draw failed" });
  }
});

export default router;
