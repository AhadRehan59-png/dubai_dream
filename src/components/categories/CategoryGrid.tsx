import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Electronics", slug: "electronics", icon: "📱", color: "from-blue-500/20 to-blue-600/10" },
  { name: "Cash", slug: "cash", icon: "💵", color: "from-green-500/20 to-green-600/10" },
  { name: "Auto", slug: "auto", icon: "🚗", color: "from-red-500/20 to-red-600/10" },
  { name: "Gold", slug: "gold", icon: "🥇", color: "from-yellow-500/20 to-yellow-600/10" },
  { name: "Lifestyle", slug: "lifestyle", icon: "✨", color: "from-pink-500/20 to-pink-600/10" },
  { name: "Travel", slug: "travel", icon: "✈️", color: "from-purple-500/20 to-purple-600/10" },
];

interface CategoryGridProps {
  activeSlug?: string;
}

export default function CategoryGrid({ activeSlug }: CategoryGridProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/categories"
        className={cn(
          "rounded-full border px-5 py-2 text-sm font-medium transition",
          !activeSlug
            ? "border-pink bg-pink/10 text-pink"
            : "border-border text-muted hover:border-white/30 hover:text-white"
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className={cn(
            "flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition",
            activeSlug === cat.slug
              ? "border-pink bg-pink/10 text-pink"
              : "border-border text-muted hover:border-white/30 hover:text-white"
          )}
        >
          <span>{cat.icon}</span>
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

export { categories };
