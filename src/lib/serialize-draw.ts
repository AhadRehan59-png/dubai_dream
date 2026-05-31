import type { DrawWithCategoryAndImages } from "@/types/prisma";
import type { HomeDraw } from "@/types/home-draw";

export function serializeDrawForHome(draw: DrawWithCategoryAndImages): HomeDraw {
  return {
    id: draw.id,
    campaignCode: draw.campaignCode,
    title: draw.title,
    description: draw.description,
    prizeValue: draw.prizeValue,
    prizeCurrency: draw.prizeCurrency,
    tokenPrice: draw.tokenPrice,
    imageUrl: draw.imageUrl,
    imageUrls: draw.images.map((img: { url: string }) => img.url),
    badge: draw.badge,
    ticketMultiplier: draw.ticketMultiplier,
    drawDate: draw.drawDate.toISOString(),
    endDate: draw.endDate.toISOString(),
    status: draw.status,
    soldTokens: draw.soldTokens,
    totalTokens: draw.totalTokens,
    category: { name: draw.category.name, slug: draw.category.slug },
    categorySlug: draw.category.slug,
  };
}
