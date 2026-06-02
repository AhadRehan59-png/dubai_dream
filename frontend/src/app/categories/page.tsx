import DrawCard from "@/components/draws/DrawCard";
import CategoryGrid from "@/components/categories/CategoryGrid";
import { apiFetchJson } from "@/lib/api";
import type { Category } from "@/types/prisma";
import type { HomeDraw } from "@/types/home-draw";

export const dynamic = "force-dynamic";

interface CategoriesPageData {
  categories: Category[];
  draws: HomeDraw[];
}

export default async function CategoriesPage() {
  const { categories, draws } = await apiFetchJson<CategoriesPageData>("/api/categories/page");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-2 text-3xl font-black text-white">All Categories</h1>
      <p className="mb-8 text-muted">Browse prizes by category and enter to win</p>

      <div className="mb-8">
        <CategoryGrid />
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat: Category) => (
          <a
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group rounded-2xl border border-border/30 bg-card p-6 transition hover:border-pink/50 hover:bg-card-hover"
          >
            <div className="mb-2 text-3xl">{cat.icon}</div>
            <h3 className="text-lg font-bold group-hover:text-pink">{cat.name}</h3>
            <p className="text-sm text-muted">{cat.description}</p>
          </a>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-bold">Active Draws</h2>
      <div className="space-y-8">
        {draws.map((draw: HomeDraw) => (
          <DrawCard
            key={draw.id}
            id={draw.id}
            campaignCode={draw.campaignCode}
            title={draw.title}
            description={draw.description}
            prizeValue={draw.prizeValue}
            prizeCurrency={draw.prizeCurrency}
            tokenPrice={draw.tokenPrice}
            imageUrl={draw.imageUrl}
            imageUrls={draw.imageUrls}
            badge={draw.badge}
            ticketMultiplier={draw.ticketMultiplier}
            drawDate={draw.drawDate}
            endDate={draw.endDate}
            status={draw.status}
            soldTokens={draw.soldTokens}
            totalTokens={draw.totalTokens}
            category={draw.category}
          />
        ))}
      </div>
    </div>
  );
}
