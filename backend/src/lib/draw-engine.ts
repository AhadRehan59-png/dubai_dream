import crypto from "crypto";
import { prisma } from "./prisma";
import { sendDrawResultEmail, sendWinnerEmail, sendWinnerSMS } from "./notifications";

export async function conductDraw(drawId: string): Promise<{ success: boolean; message: string }> {
  const draw = await prisma.draw.findUnique({
    where: { id: drawId },
    include: { tokens: { include: { user: true } } },
  });

  if (!draw) return { success: false, message: "Draw not found" };
  if (draw.status === "COMPLETED") return { success: false, message: "Draw already completed" };
  if (draw.tokens.length === 0) return { success: false, message: "No tokens sold" };

  const seed = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(seed + drawId).digest("hex");
  const randomIndex = parseInt(hash.substring(0, 8), 16) % draw.tokens.length;
  const winningToken = draw.tokens[randomIndex];

  await prisma.draw.update({
    where: { id: drawId },
    data: {
      status: "COMPLETED",
      winnerId: winningToken.userId,
      winnerTokenId: winningToken.id,
      drawSeed: seed,
      drawnAt: new Date(),
    },
  });

  for (const token of draw.tokens) {
    const isWinner = token.id === winningToken.id;
    await prisma.notification.create({
      data: {
        userId: token.userId,
        type: isWinner ? "WIN" : "DRAW_RESULT",
        title: isWinner ? "Congratulations! You Won!" : "Draw Completed",
        message: isWinner
          ? `You won ${draw.title}! Token: ${winningToken.tokenNumber}`
          : `Draw ${draw.campaignCode} completed. Winner token: ${winningToken.tokenNumber}`,
        sentVia: "email",
      },
    });
  }

  await sendWinnerEmail(
    winningToken.user.email,
    winningToken.user.firstName,
    draw.title,
    winningToken.tokenNumber
  );

  if (winningToken.user.phone) {
    await sendWinnerSMS(
      winningToken.user.phone,
      draw.title,
      winningToken.tokenNumber
    );
  }

  for (const token of draw.tokens) {
    if (token.userId !== winningToken.userId) {
      await sendDrawResultEmail(
        token.user.email,
        token.user.firstName,
        draw.title,
        draw.campaignCode,
        winningToken.tokenNumber
      );
    }
  }

  return {
    success: true,
    message: `Winner selected: ${winningToken.tokenNumber}`,
  };
}

export async function checkAndRunPendingDraws() {
  const now = new Date();
  const activeDraws = await prisma.draw.findMany({
    where: {
      status: { in: ["ACTIVE", "SOLD_OUT"] },
    },
    include: { _count: { select: { tokens: true } } },
  });

  const results = [];
  for (const draw of activeDraws) {
    if (draw._count.tokens === 0) continue;
    const shouldDraw =
      draw.soldTokens >= draw.totalTokens || draw.endDate <= now;
    if (shouldDraw) {
      const result = await conductDraw(draw.id);
      results.push({ drawId: draw.id, ...result });
    }
  }
  return results;
}
