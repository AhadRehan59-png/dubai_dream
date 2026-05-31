import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { generateCampaignCode } from "@/lib/utils";

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

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = drawSchema.parse(body);

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

    return NextResponse.json({ success: true, draw });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create draw" }, { status: 500 });
  }
}
