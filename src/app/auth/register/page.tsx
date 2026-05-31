"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard/tickets";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email.trim().toLowerCase(),
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-3xl border border-border/30 bg-card p-8">
        <h1 className="mb-2 text-2xl font-black text-white">Create Account</h1>
        <p className="mb-8 text-sm text-muted">Join Dream Dubai and start winning</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red/10 p-3 text-sm text-red">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-muted">First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                className="w-full rounded-xl border border-border bg-black px-4 py-3 text-white outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                className="w-full rounded-xl border border-border bg-black px-4 py-3 text-white outline-none focus:border-pink"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-xl border border-border bg-black px-4 py-3 text-white outline-none focus:border-pink"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Phone (for SMS notifications)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-border bg-black px-4 py-3 text-white outline-none focus:border-pink"
              placeholder="+971 50 000 0000"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Password</label>
            <PasswordInput
              value={form.password}
              onChange={(password) => setForm({ ...form, password })}
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Confirm Password</label>
            <PasswordInput
              value={form.confirmPassword}
              onChange={(confirmPassword) => setForm({ ...form, confirmPassword })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue py-3 font-bold text-white transition hover:bg-blue/80 disabled:opacity-50"
          >
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href={`/auth/login${redirect !== "/dashboard/tickets" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="text-pink hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
