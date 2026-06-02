"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard/tickets";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-3xl border border-border/30 bg-card p-8">
        <h1 className="mb-2 text-2xl font-black text-white">Welcome Back</h1>
        <p className="mb-8 text-sm text-muted">Login to your Dream Dubai account</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red/10 p-3 text-sm text-red">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-black px-4 py-3 text-white outline-none focus:border-pink"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Password</label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue py-3 font-bold text-white transition hover:bg-blue/80 disabled:opacity-50"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/register${redirect !== "/dashboard/tickets" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="text-pink hover:underline"
          >
            Sign up
          </Link>
        </p>

        <div className="mt-4 rounded-lg bg-[#111] p-3 text-xs text-muted">
          <strong>Demo:</strong> admin@dreamdubai.ae / admin123 or user@example.com / user123
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
