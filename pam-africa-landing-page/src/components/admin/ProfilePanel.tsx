"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAdminAction } from "@/components/admin/AdminActionProvider";

export default function ProfilePanel({ email }: { email: string }) {
  const { runAction } = useAdminAction();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirm) {
      setMessage("New passwords do not match");
      return;
    }
    setMessage("");
    try {
      await runAction("Updating password", async () => {
        const response = await fetch("/api/admin/profile/password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Update failed");
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirm("");
        return result;
      });
      setMessage("Password updated.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="max-w-md">
      <p className="text-sm text-white/50">Signed in as</p>
      <p className="mt-1 text-lg">{email}</p>

      <form onSubmit={onSubmit} className="mt-10 grid gap-4">
        <h2 className="text-lg">Change password</h2>
        <label className="grid gap-2 text-sm">
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
          />
        </label>
        <label className="grid gap-2 text-sm">
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            required
            className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Confirm new password
          <input
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            minLength={8}
            required
            className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
          />
        </label>
        <button type="submit" className="bg-white px-5 py-3 text-sm text-black">
          Save password
        </button>
      </form>

      <Link
        href="/admin/forgot-password"
        className="mt-6 inline-block text-sm text-white/50 underline underline-offset-4"
      >
        Forgot password? Email reset link
      </Link>

      {message && (
        <p className="mt-6 border border-white/10 bg-white/5 px-4 py-3 text-sm">{message}</p>
      )}
    </div>
  );
}
