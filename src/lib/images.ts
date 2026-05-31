/** Category-specific images via Pexels (stable CDN, themed per category) */

function p(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`;
}

export const FALLBACK_IMAGE = p(164527);

export const CATEGORY_IMAGES: Record<string, string[]> = {
  electronics: [
    p(1092644), // smartphone
    p(18105),   // laptop
    p(341114),  // MacBook
    p(792199),  // headphones
    p(4158),    // Apple devices
    p(356056),  // tech workspace
    p(163117),  // keyboard & tech
  ],
  cash: [
    p(164527),  // dollar bills
    p(106152),  // money stack
    p(438643),  // cash on desk
    p(259200),  // coins
    p(313706),  // currency
    p(394372),  // money savings
    p(394387),  // finance cash
  ],
  auto: [
    p(170811),  // luxury car
    p(1149137), // sports car
    p(112460),  // classic car
    p(210019),  // car on road
    p(2449454), // Mercedes style
    p(116675),  // car interior
    p(919073),  // luxury vehicle
  ],
  gold: [
    p(128867),  // gold coins
    p(1024543), // gold jewelry
    p(283243),  // luxury watch
    p(3266704), // gold accessories
    p(883875),  // diamond ring
    p(1927259), // necklace
    p(1577719), // golden jewelry
  ],
  lifestyle: [
    p(258154),   // luxury villa pool
    p(271624),   // luxury bedroom
    p(1267320),  // spa wellness
    p(941690),   // fine dining
    p(261189),   // luxury home
    p(2372721),  // tropical resort / Maldives
    p(338504),   // luxury lifestyle
  ],
  travel: [
    p(457882),  // beach paradise
    p(248797),  // tropical beach
    p(1268855), // mountain lake
    p(3601425), // airplane travel
    p(3787839), // travel adventure
    p(1450360), // scenic destination
    p(2506923), // coastal travel
  ],
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
