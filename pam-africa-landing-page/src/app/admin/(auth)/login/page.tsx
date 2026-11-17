"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [configMessage, setConfigMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/setup")
      .then((response) => response.json())
      .then((result) => {
        if (result.needsSetup) setNeedsSetup(true);
        if (!result.configured && result.message) {
          setConfigMessage(result.message);
        }
      })
      .catch(() => undefined);
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Sign in failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#000000] px-4 font-[family-name:var(--font-helvetica-now)] text-white">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-white/10 bg-[#131313] p-8"
      >
        <p className="text-sm text-white/40">PAM Africa</p>
        <h1 className="mt-2 text-3xl">Admin</h1>
        <p className="mt-3 text-sm text-white/50">
          Sign in to manage journals and media.
        </p>

        {configMessage && (
          <p className="mt-6 border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
            {configMessage}
          </p>
        )}

        {needsSetup && (
          <p className="mt-6 border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
            No admin account exists yet. Please contact support@pamafrica.com to get access.
          </p>
        )}

        {error && (
          <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <label className="mt-8 grid gap-2 text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="border border-white/10 bg-black px-3 py-3 outline-none focus:border-white"
          />
        </label>
        <label className="mt-4 grid gap-2 text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="border border-white/10 bg-black px-3 py-3 outline-none focus:border-white"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-white py-3 text-black disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link
          href="/admin/forgot-password"
          className="mt-4 block text-center text-sm text-white/50 underline underline-offset-4"
        >
          Forgot password
        </Link>
      </form>
    </main>
  );
}
