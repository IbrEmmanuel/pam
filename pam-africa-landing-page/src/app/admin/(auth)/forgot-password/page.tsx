"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not send reset email");
      }
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
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
        <h1 className="mt-2 text-3xl">Forgot password</h1>
        <p className="mt-3 text-sm text-white/50">
          If an account exists for this email, we will send a reset link.
        </p>

        {error && (
          <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-6 border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
            {message}
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
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-white py-3 text-black disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
        <Link
          href="/admin/login"
          className="mt-4 block text-center text-sm text-white/50 underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </form>
    </main>
  );
}
