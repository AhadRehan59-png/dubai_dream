/** Category-specific images via Pexels (stable CDN, themed per category) */

function p(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`;
}

export const FALLBACK_IMAGE = p(164527);

export const CATEGORY_IMAGES: Record<string, string[]> = {
  electronics: [p(1092644), p(18105), p(341114), p(792199), p(4158), p(356056), p(163117)],
  cash: [p(164527), p(106152), p(438643), p(259200), p(313706), p(394372), p(394387)],
  auto: [p(170811), p(1149137), p(112460), p(210019), p(2449454), p(116675), p(919073)],
  gold: [p(128867), p(1024543), p(283243), p(3266704), p(883875), p(1927259), p(1577719)],
  lifestyle: [p(258154), p(271624), p(1267320), p(941690), p(261189), p(2372721), p(338504)],
  travel: [p(457882), p(248797), p(1268855), p(3601425), p(3787839), p(1450360), p(2506923)],
};

export function getCategoryImages(slug: string): string[] {
  return CATEGORY_IMAGES[slug] ?? CATEGORY_IMAGES.cash;
}

export function getDrawImages(_campaignCode: string, categorySlug: string): string[] {
  return getCategoryImages(categorySlug);
}

export function getPrimaryImage(_campaignCode: string, categorySlug: string): string {
  return getCategoryImages(categorySlug)[0];
}
