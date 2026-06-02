import { notFound } from "next/navigation";
import DrawCard from "@/components/draws/DrawCard";
import CategoryGrid from "@/components/categories/CategoryGrid";
import ImageGallery from "@/components/ui/ImageGallery";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

interface CategoryDraw {
  id: string;
  campaignCode: string;
  title: string;
  description: string;
  prizeValue: number;
  prizeCurrency: string;
  tokenPrice: number;
  imageUrl: string;
  imageUrls: string[];
  badge: string | null;
  ticketMultiplier: number;
  drawDate: string;
  endDate: string;
  status: string;
  soldTokens: number;
  totalTokens: number;
  category: { name: string; slug: string };
}

interface CategoryPageData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  images: { url: string }[];
  draws: CategoryDraw[];
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const res = await apiFetch(`/api/categories/${slug}`);

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to load category");

  const category: CategoryPageData = await res.json();
  const categoryImages = category.images.map((img) => img.url);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-3xl font-black text-white">{category.name}</h1>
          <p className="text-muted">{category.description}</p>
        </div>
      </div>

      {categoryImages.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-white">Gallery</h2>
          <ImageGallery images={categoryImages} alt={category.name} />
        </div>
      )}

      <div className="mb-8">
        <CategoryGrid activeSlug={slug} />
      </div>

      <div className="space-y-8">
        {category.draws.length === 0 ? (
          <p className="text-muted">No draws in this category yet.</p>
        ) : (
          category.draws.map((draw) => (
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
          ))
        )}
      </div>
    </div>
  );
}
