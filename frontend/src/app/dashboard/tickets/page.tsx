import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import type { TokenWithDraw } from "@/types/prisma";
import { Ticket, Trophy, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

interface TicketsData {
  tokens: TokenWithDraw[];
}

export default async function TicketsDashboard() {
  const res = await apiFetch("/api/dashboard/tickets");
  if (res.status === 401) redirect("/auth/login?redirect=/dashboard/tickets");
  if (!res.ok) throw new Error("Failed to load tickets");

  const { tokens }: TicketsData = await res.json();

  const activeTokens = tokens.filter(
    (t) => t.draw.status === "ACTIVE" || t.draw.status === "SOLD_OUT"
  );
  const completedTokens = tokens.filter((t) => t.draw.status === "COMPLETED");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">My Tickets</h1>
          <p className="text-muted">Track your purchased tokens and draw entries</p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-blue px-6 py-2 text-sm font-bold text-white hover:bg-blue/80"
        >
          BUY MORE
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/30 bg-card p-4 text-center">
          <Ticket className="mx-auto mb-2 text-pink" size={24} />
          <div className="text-2xl font-black">{tokens.length}</div>
          <div className="text-xs text-muted">Total Tokens</div>
        </div>
        <div className="rounded-2xl border border-border/30 bg-card p-4 text-center">
          <Clock className="mx-auto mb-2 text-blue" size={24} />
          <div className="text-2xl font-black">{activeTokens.length}</div>
          <div className="text-xs text-muted">Active Entries</div>
        </div>
        <div className="rounded-2xl border border-border/30 bg-card p-4 text-center">
          <Trophy className="mx-auto mb-2 text-yellow" size={24} />
          <div className="text-2xl font-black">{completedTokens.length}</div>
          <div className="text-xs text-muted">Completed</div>
        </div>
      </div>

      {tokens.length === 0 ? (
        <div className="rounded-3xl border border-border/30 bg-card p-12 text-center">
          <p className="text-muted">No tickets yet. Purchase tokens to enter draws!</p>
          <Link href="/" className="mt-4 inline-block text-pink hover:underline">
            Browse Draws
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tokens.map((token) => (
            <div
              key={token.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/30 bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="text-xs text-pink">{token.draw.category.name}</div>
                <h3 className="font-bold text-white">{token.draw.title}</h3>
                <div className="mt-1 text-sm text-muted">
                  Campaign: {token.draw.campaignCode} · Purchased: {formatDate(token.purchasedAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold text-pink">
                  {token.tokenNumber}
                </div>
                <div className={`text-xs ${
                  token.draw.status === "COMPLETED" ? "text-yellow" :
                  token.draw.status === "ACTIVE" ? "text-green-400" : "text-muted"
                }`}>
                  {token.draw.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
