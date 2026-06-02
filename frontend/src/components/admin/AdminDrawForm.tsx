"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface AdminDrawFormProps {
  categories: Category[];
}

export default function AdminDrawForm({ categories }: AdminDrawFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    prizeValue: "",
    tokenPrice: "",
    totalTokens: "",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
    categoryId: categories[0]?.id || "",
    badge: "",
    ticketMultiplier: "1",
    drawDays: "7",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/draws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create draw");

      router.refresh();
      setForm({ ...form, title: "", description: "", prizeValue: "", tokenPrice: "", totalTokens: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border/30 bg-card p-6">
      {error && <div className="mb-4 rounded-lg bg-red/10 p-3 text-sm text-red">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { key: "title", label: "Prize Title", placeholder: "AED 100,000 Cash" },
          { key: "description", label: "Description", placeholder: "Win cash prize..." },
          { key: "prizeValue", label: "Prize Value (AED)", type: "number" },
          { key: "tokenPrice", label: "Token Price (AED)", type: "number" },
          { key: "totalTokens", label: "Total Tokens", type: "number" },
          { key: "imageUrl", label: "Image URL" },
          { key: "badge", label: "Badge (optional)", placeholder: "HOT" },
          { key: "drawDays", label: "Draw Duration (days)", type: "number" },
        ].map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-sm text-muted">{field.label}</label>
            <input
              type={field.type || "text"}
              value={form[field.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              required={!["badge"].includes(field.key)}
              className="w-full rounded-xl border border-border bg-black px-4 py-2 text-white outline-none focus:border-pink"
            />
          </div>
        ))}

        <div>
          <label className="mb-1 block text-sm text-muted">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full rounded-xl border border-border bg-black px-4 py-2 text-white outline-none focus:border-pink"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-full bg-pink px-8 py-3 font-bold text-white hover:bg-pink/80 disabled:opacity-50"
      >
        {loading ? "CREATING..." : "CREATE DRAW"}
      </button>
    </form>
  );
}
