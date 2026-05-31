import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import AdminDrawForm from "@/components/admin/AdminDrawForm";
import type { AdminUser, Category, DrawWithCategoryAndCount } from "@/types/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/auth/login?redirect=/admin");

  const [categories, draws, users, stats]: [
    Category[],
    DrawWithCategoryAndCount[],
    AdminUser[],
    [number, number, number, number],
  ] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.draw.findMany({
      include: { category: true, _count: { select: { tokens: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Panel</h1>
          <p className="text-muted">Manage categories, draws, users, and payments</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-white">
            Logout
          </button>
        </form>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Users", value: userCount },
          { label: "Draws", value: drawCount },
          { label: "Tokens Sold", value: tokenCount },
          { label: "Payments", value: paymentCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/30 bg-card p-4 text-center">
            <div className="text-2xl font-black text-pink">{stat.value}</div>
            <div className="text-xs text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="mb-4 text-xl font-bold">Create New Draw</h2>
        <AdminDrawForm categories={categories} />
      </div>

      <div className="mb-12">
        <h2 className="mb-4 text-xl font-bold">Manage Draws</h2>
        <div className="overflow-x-auto rounded-2xl border border-border/30">
          <table className="w-full text-sm">
            <thead className="bg-[#111] text-left text-muted">
              <tr>
                <th className="p-4">Campaign</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tokens</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw: DrawWithCategoryAndCount) => (
                <tr key={draw.id} className="border-t border-border/30">
                  <td className="p-4 font-mono text-pink">{draw.campaignCode}</td>
                  <td className="p-4">{draw.title}</td>
                  <td className="p-4">{draw.category.name}</td>
                  <td className="p-4">{draw.soldTokens}/{draw.totalTokens}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      draw.status === "ACTIVE" ? "bg-green-400/10 text-green-400" :
                      draw.status === "COMPLETED" ? "bg-yellow/10 text-yellow" :
                      "bg-muted/10 text-muted"
                    }`}>
                      {draw.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/draw/${draw.id}`} className="text-blue hover:underline text-xs">
                        View
                      </Link>
                      {(draw.status === "ACTIVE" || draw.status === "SOLD_OUT") && draw._count.tokens > 0 && (
                        <form action={`/api/admin/draws/${draw.id}/conduct`} method="POST">
                          <button type="submit" className="text-pink hover:underline text-xs">
                            Run Draw
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Recent Users</h2>
        <div className="overflow-x-auto rounded-2xl border border-border/30">
          <table className="w-full text-sm">
            <thead className="bg-[#111] text-left text-muted">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: AdminUser) => (
                <tr key={u.id} className="border-t border-border/30">
                  <td className="p-4">{u.firstName} {u.lastName}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
