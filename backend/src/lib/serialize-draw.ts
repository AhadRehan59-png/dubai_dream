export function serializeDrawForHome(draw: {
  id: string;
  campaignCode: string;
  title: string;
  description: string;
  prizeValue: number;
  prizeCurrency: string;
  tokenPrice: number;
  imageUrl: string;
  badge: string | null;
  ticketMultiplier: number;
  drawDate: Date;
  endDate: Date;
  status: string;
  soldTokens: number;
  totalTokens: number;
  category: { name: string; slug: string };
  images: { url: string }[];
}) {
  return {
    id: draw.id,
    campaignCode: draw.campaignCode,
    title: draw.title,
    description: draw.description,
    prizeValue: draw.prizeValue,
    prizeCurrency: draw.prizeCurrency,
    tokenPrice: draw.tokenPrice,
    imageUrl: draw.imageUrl,
    imageUrls: draw.images.map((img) => img.url),
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
