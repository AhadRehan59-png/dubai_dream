export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateTokenNumber(campaignCode: string, sequence: number): string {
  const padded = String(sequence).padStart(6, "0");
  return `${campaignCode}-${padded}`;
}

export function generateCampaignCode(): string {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `DC-${num}`;
}

export function formatDisplayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}
