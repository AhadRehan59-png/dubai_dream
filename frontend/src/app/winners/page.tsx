import { formatDate, formatNumber } from "@/lib/utils";
import { Trophy, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import { apiFetchJson } from "@/lib/api";
import type { CompletedDrawWithWinner, Token } from "@/types/prisma";

export const dynamic = "force-dynamic";

interface WinnersData {
  completedDraws: CompletedDrawWithWinner[];
  winningTokens: (Token | null)[];
}

export default async function WinnersPage() {
  const { completedDraws, winningTokens } = await apiFetchJson<WinnersData>("/api/winners");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-center">
        <Trophy className="mx-auto mb-4 text-yellow" size={48} />
        <h1 className="text-3xl font-black text-white">Winners</h1>
        <p className="mt-2 text-muted">Past draw results and lucky winners</p>
      </div>

      {completedDraws.length === 0 ? (
        <div className="rounded-3xl border border-border/30 bg-card p-12 text-center">
          <p className="text-muted">No completed draws yet. Be the first winner!</p>
          <Link href="/" className="mt-4 inline-block text-pink hover:underline">
            Browse Active Draws
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {completedDraws.map((draw: CompletedDrawWithWinner, index: number) => {
            const winningToken = winningTokens[index];
            return (
              <div
                key={draw.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/30 bg-card p-6 sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow/10 text-2xl">
                  🏆
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-xs text-pink">{draw.category.name}</div>
                  <h3 className="text-lg font-bold text-white">{draw.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {draw.drawnAt ? formatDate(draw.drawnAt) : "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash size={14} />
                      {draw.campaignCode}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted">Winner</div>
                  <div className="font-bold text-white">
                    {draw.winner?.firstName} {draw.winner?.lastName?.charAt(0)}.
                  </div>
                  {winningToken && (
                    <div className="mt-1 font-mono text-xs text-pink">
                      Token: {winningToken.tokenNumber}
                    </div>
                  )}
                  <div className="mt-1 text-sm font-bold text-yellow">
                    {draw.prizeCurrency} {formatNumber(draw.prizeValue)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
