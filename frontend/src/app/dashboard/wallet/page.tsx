import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import type { PaymentWithDraw } from "@/types/prisma";
import { Wallet, CreditCard, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface WalletData {
  user: { walletBalance: number };
  payments: PaymentWithDraw[];
}

export default async function WalletDashboard() {
  const res = await apiFetch("/api/dashboard/wallet");
  if (res.status === 401) redirect("/auth/login?redirect=/dashboard/wallet");
  if (!res.ok) throw new Error("Failed to load wallet");

  const { user, payments }: WalletData = await res.json();

  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-2 text-3xl font-black text-white">Wallet</h1>
      <p className="mb-8 text-muted">Your balance and payment history</p>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border/30 bg-gradient-to-br from-pink/10 to-blue/10 p-8">
          <Wallet className="mb-4 text-pink" size={32} />
          <div className="text-sm text-muted">Wallet Balance</div>
          <div className="text-4xl font-black text-white">
            {formatCurrency(user.walletBalance)}
          </div>
        </div>
        <div className="rounded-3xl border border-border/30 bg-card p-8">
          <CreditCard className="mb-4 text-blue" size={32} />
          <div className="text-sm text-muted">Total Spent</div>
          <div className="text-4xl font-black text-white">
            {formatCurrency(totalSpent)}
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold">Payment History</h2>
      {payments.length === 0 ? (
        <div className="rounded-2xl border border-border/30 bg-card p-8 text-center text-muted">
          No payments yet
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-2xl border border-border/30 bg-card p-4"
            >
              <div>
                <div className="font-medium text-white">{payment.draw.title}</div>
                <div className="text-sm text-muted">
                  {formatDate(payment.createdAt)} · {payment.quantity} token(s)
                  {payment.paymentMethod && (
                    <span className="ml-1 capitalize">· {payment.paymentMethod.replace("_", " ")}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{formatCurrency(payment.amount)}</div>
                <div className={`text-xs ${
                  payment.status === "COMPLETED" ? "text-green-400" :
                  payment.status === "PENDING" ? "text-yellow" : "text-red"
                }`}>
                  {payment.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/dashboard/tickets"
          className="inline-flex items-center gap-2 text-pink hover:underline"
        >
          View My Tickets <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
