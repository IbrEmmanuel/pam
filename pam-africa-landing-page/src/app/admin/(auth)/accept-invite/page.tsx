"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthFormSkeleton from "@/components/admin/AuthFormSkeleton";

function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not activate account");
      }
      router.push("/admin/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not activate account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md border border-white/10 bg-[#131313] p-8"
    >
      <p className="text-sm text-white/40">PAM Africa</p>
      <h1 className="mt-2 text-3xl">Accept invite</h1>
      <p className="mt-3 text-sm text-white/50">
        Set a password to access the journal admin.
      </p>

      {error && (
        <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <label className="mt-8 grid gap-2 text-sm">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
          className="border border-white/10 bg-black px-3 py-3 outline-none focus:border-white"
        />
      </label>
      <label className="mt-4 grid gap-2 text-sm">
        Confirm password
        <input
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          minLength={8}
          required
          className="border border-white/10 bg-black px-3 py-3 outline-none focus:border-white"
        />
      </label>
      <button
        type="submit"
        disabled={loading || !token}
        className="mt-8 w-full bg-white py-3 text-black disabled:opacity-50"
      >
        {loading ? "Saving…" : "Create account"}
      </button>
      <Link
        href="/admin/login"
        className="mt-4 block text-center text-sm text-white/50 underline underline-offset-4"
      >
        Back to sign in
      </Link>
    </form>
  );
}

export default function AcceptInvitePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#000000] px-4 font-[family-name:var(--font-helvetica-now)] text-white">
      <Suspense fallback={<AuthFormSkeleton />}>
        <AcceptInviteForm />
      </Suspense>
    </main>
  );
}
