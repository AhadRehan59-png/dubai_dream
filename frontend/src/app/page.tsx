import HomeDrawsSection from "@/components/draws/HomeDrawsSection";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { apiFetchJson } from "@/lib/api";
import type { HomeDraw } from "@/types/home-draw";

export const dynamic = "force-dynamic";

interface HomeData {
  draws: HomeDraw[];
  stats: {
    totalWinners: number;
    totalDraws: number;
    totalTokens: number;
  };
}

export default async function HomePage() {
  let draws: HomeDraw[] = [];
  let stats = { totalWinners: 0, totalDraws: 0, totalTokens: 0 };

  try {
    const data = await apiFetchJson<HomeData>("/api/home");
    draws = data.draws;
    stats = data.stats;
  } catch {
    // Backend unavailable — show empty state instead of crashing the page.
  }

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

      {draws.length === 0 ? (
        <div className="rounded-3xl border border-border/30 bg-card p-12 text-center">
          <p className="text-muted">No active draws at the moment. Check back soon!</p>
          <Link href="/admin" className="mt-4 inline-block text-pink hover:underline">
            Admin Panel
          </Link>
        </div>
      ) : (
        <HomeDrawsSection draws={draws} />
      )}
    </div>
  );
}
