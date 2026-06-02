"use client";

import { useState } from "react";
import DrawCard from "@/components/draws/DrawCard";
import CategoryFilterBar from "@/components/categories/CategoryFilterBar";
import type { HomeDraw } from "@/types/home-draw";

interface HomeDrawsSectionProps {
  draws: HomeDraw[];
}

export default function HomeDrawsSection({ draws }: HomeDrawsSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filteredDraws = activeSlug
    ? draws.filter((draw) => draw.categorySlug === activeSlug)
    : draws;

  return (
    <>
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-white">Browse Categories</h2>
        <CategoryFilterBar activeSlug={activeSlug} onSelect={setActiveSlug} />
      </div>

      <div className="space-y-8">
        {filteredDraws.length === 0 ? (
          <div className="rounded-3xl border border-border/30 bg-card p-12 text-center">
            <p className="text-muted">No active draws in this category right now.</p>
          </div>
        ) : (
          filteredDraws.map(({ categorySlug: _slug, ...draw }) => (
            <DrawCard key={draw.id} {...draw} />
          ))
        )}
      </div>
    </>
  );
}
