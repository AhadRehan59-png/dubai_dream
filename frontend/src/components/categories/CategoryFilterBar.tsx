"use client";

import { cn } from "@/lib/utils";
import { categories } from "@/components/categories/CategoryGrid";

interface CategoryFilterBarProps {
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryFilterBar({ activeSlug, onSelect }: CategoryFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full border px-5 py-2 text-sm font-medium transition",
          activeSlug === null
            ? "border-pink bg-pink/10 text-pink"
            : "border-border text-muted hover:border-white/30 hover:text-white"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          onClick={() => onSelect(cat.slug)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition",
            activeSlug === cat.slug
              ? "border-pink bg-pink/10 text-pink"
              : "border-border text-muted hover:border-white/30 hover:text-white"
          )}
        >
          <span>{cat.icon}</span>
          {cat.name}
        </button>
      ))}
    </div>
  );
}
