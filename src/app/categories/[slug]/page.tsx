import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DrawCard from "@/components/draws/DrawCard";
import CategoryGrid from "@/components/categories/CategoryGrid";
import ImageGallery from "@/components/ui/ImageGallery";
import type { CategoryWithGalleryAndDraws } from "@/types/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category: CategoryWithGalleryAndDraws | null = await prisma.category.findUnique({
    where: { slug },
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

  if (!category) notFound();

  const categoryImages = category.images.map((img: { url: string }) => img.url);

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
          category.draws.map((draw: CategoryWithGalleryAndDraws["draws"][number]) => (
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
              imageUrls={draw.images.map((img: { url: string }) => img.url)}
              badge={draw.badge}
              ticketMultiplier={draw.ticketMultiplier}
              drawDate={draw.drawDate.toISOString()}
              endDate={draw.endDate.toISOString()}
              status={draw.status}
              soldTokens={draw.soldTokens}
              totalTokens={draw.totalTokens}
              category={{ name: draw.category.name, slug: draw.category.slug }}
            />
          ))
        )}
      </div>
    </div>
  );
}
