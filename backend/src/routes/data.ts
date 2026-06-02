import { Router } from "express";
import { prisma } from "../lib/prisma";
import { checkAndRunPendingDraws } from "../lib/draw-engine";
import { serializeDrawForHome } from "../lib/serialize-draw";
import { getCurrentUser, requireAdmin } from "../lib/auth";

const router = Router();

router.get("/home", async (_req, res) => {
  const [draws, stats] = await Promise.all([
    prisma.draw.findMany({
      where: { status: { in: ["ACTIVE", "SOLD_OUT"] } },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    Promise.all([
      prisma.draw.count({ where: { status: "COMPLETED" } }),
      prisma.draw.count(),
      prisma.token.count(),
    ]),
  ]);

  const [totalWinners, totalDraws, totalTokens] = stats;

  return res.json({
    draws: draws.map(serializeDrawForHome),
    stats: { totalWinners, totalDraws, totalTokens },
  });
});

router.get("/categories/page", async (_req, res) => {
  const [categories, draws] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.draw.findMany({
      where: { status: { in: ["ACTIVE", "SOLD_OUT"] } },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return res.json({
    categories,
    draws: draws.map((draw) => serializeDrawForHome(draw)),
  });
});

router.get("/categories/:slug", async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { slug: req.params.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      draws: {
        where: { status: { in: ["ACTIVE", "SOLD_OUT", "COMPLETED"] } },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  return res.json({
    ...category,
    draws: category.draws.map((draw) => ({
      id: draw.id,
      campaignCode: draw.campaignCode,
      title: draw.title,
      description: draw.description,
      prizeValue: draw.prizeValue,
      prizeCurrency: draw.prizeCurrency,
      tokenPrice: draw.tokenPrice,
      imageUrl: draw.imageUrl,
      imageUrls: draw.images.map((img) => img.url),
      badge: draw.badge,
      ticketMultiplier: draw.ticketMultiplier,
      drawDate: draw.drawDate.toISOString(),
      endDate: draw.endDate.toISOString(),
      status: draw.status,
      soldTokens: draw.soldTokens,
      totalTokens: draw.totalTokens,
      category: { name: draw.category.name, slug: draw.category.slug },
    })),
  });
});

router.get("/draws/:id", async (req, res) => {
  const draw = await prisma.draw.findUnique({
    where: { id: req.params.id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!draw) {
    return res.status(404).json({ error: "Draw not found" });
  }

  const user = await getCurrentUser(req);

  return res.json({
    draw: {
      id: draw.id,
      campaignCode: draw.campaignCode,
      title: draw.title,
      description: draw.description,
      prizeValue: draw.prizeValue,
      prizeCurrency: draw.prizeCurrency,
      tokenPrice: draw.tokenPrice,
      imageUrl: draw.imageUrl,
      imageUrls: draw.images.map((img) => img.url),
      badge: draw.badge,
      drawDate: draw.drawDate.toISOString(),
      endDate: draw.endDate.toISOString(),
      status: draw.status,
      soldTokens: draw.soldTokens,
      totalTokens: draw.totalTokens,
      category: { name: draw.category.name, slug: draw.category.slug },
    },
    user: user
      ? { id: user.id, email: user.email, firstName: user.firstName, role: user.role }
      : null,
  });
});

router.get("/winners", async (_req, res) => {
  const completedDraws = await prisma.draw.findMany({
    where: { status: "COMPLETED", winnerId: { not: null } },
    include: {
      category: true,
      winner: { select: { firstName: true, lastName: true } },
    },
    orderBy: { drawnAt: "desc" },
  });

  const winningTokens = await Promise.all(
    completedDraws.map(async (draw) => {
      if (!draw.winnerTokenId) return null;
      return prisma.token.findUnique({ where: { id: draw.winnerTokenId } });
    })
  );

  return res.json({
    completedDraws: completedDraws.map((draw) => ({
      ...draw,
      drawnAt: draw.drawnAt?.toISOString() ?? null,
    })),
    winningTokens,
  });
});

router.get("/dashboard/wallet", async (req, res) => {
  const user = await getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    include: { draw: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return res.json({
    user: {
      walletBalance: user.walletBalance,
    },
    payments: payments.map((payment) => ({
      ...payment,
      createdAt: payment.createdAt.toISOString(),
    })),
  });
});

router.get("/dashboard/tickets", async (req, res) => {
  const user = await getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tokens = await prisma.token.findMany({
    where: { userId: user.id },
    include: {
      draw: { include: { category: true } },
    },
    orderBy: { purchasedAt: "desc" },
  });

  return res.json({
    tokens: tokens.map((token) => ({
      ...token,
      purchasedAt: token.purchasedAt.toISOString(),
      draw: {
        ...token.draw,
        drawDate: token.draw.drawDate.toISOString(),
        endDate: token.draw.endDate.toISOString(),
      },
    })),
  });
});

router.get("/admin/overview", async (req, res) => {
  try {
    await requireAdmin(req);

    const [categories, draws, users, stats] = await Promise.all([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.draw.findMany({
        include: { category: true, _count: { select: { tokens: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      Promise.all([
        prisma.user.count(),
        prisma.draw.count(),
        prisma.token.count(),
        prisma.payment.count({ where: { status: "COMPLETED" } }),
      ]),
    ]);

    const [userCount, drawCount, tokenCount, paymentCount] = stats;

    return res.json({
      categories,
      draws,
      users: users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
      stats: { userCount, drawCount, tokenCount, paymentCount },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return res.status(403).json({ error: "Forbidden" });
    }
    return res.status(500).json({ error: "Failed to load admin data" });
  }
});

export default router;
