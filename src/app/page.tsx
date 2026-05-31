import { prisma } from "@/lib/prisma";
import HomeDrawsSection from "@/components/draws/HomeDrawsSection";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { serializeDrawForHome } from "@/lib/serialize-draw";
import type { DrawWithCategoryAndImages } from "@/types/prisma";

export const dynamic = "force-dynamic";

async function getActiveDraws(): Promise<DrawWithCategoryAndImages[]> {
  return prisma.draw.findMany({
    where: { status: { in: ["ACTIVE", "SOLD_OUT"] } },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getStats() {
  const [totalWinners, totalDraws, totalTokens] = await Promise.all([
    prisma.draw.count({ where: { status: "COMPLETED" } }),
    prisma.draw.count(),
    prisma.token.count(),
  ]);
  return { totalWinners, totalDraws, totalTokens };
}

export default async function HomePage() {
  const [draws, stats] = await Promise.all([getActiveDraws(), getStats()]);

  const drawCards = draws.map(serializeDrawForHome);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 grid grid-cols-3 gap-4 rounded-2xl border border-border/30 bg-card/50 p-6">
        <div className="text-center">
          <div className="text-2xl font-black text-pink lg:text-3xl">{stats.totalWinners}+</div>
          <div className="text-xs text-muted lg:text-sm">Happy Winners</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-blue lg:text-3xl">{stats.totalDraws}+</div>
          <div className="text-xs text-muted lg:text-sm">Total Draws</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-white lg:text-3xl">{formatNumber(stats.totalTokens)}+</div>
          <div className="text-xs text-muted lg:text-sm">Tokens Sold</div>
        </div>
      </div>

      {drawCards.length === 0 ? (
        <div className="rounded-3xl border border-border/30 bg-card p-12 text-center">
          <p className="text-muted">No active draws at the moment. Check back soon!</p>
          <Link href="/admin" className="mt-4 inline-block text-pink hover:underline">
            Admin Panel
          </Link>
        </div>
      ) : (
        <HomeDrawsSection draws={drawCards} />
      )}
    </div>
  );
}
