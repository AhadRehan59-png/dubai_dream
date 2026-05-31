import type { DrawCardProps } from "@/components/draws/DrawCard";

export type HomeDraw = DrawCardProps & {
  categorySlug: string;
};
