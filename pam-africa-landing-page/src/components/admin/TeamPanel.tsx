"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AdminRole } from "@/lib/auth/users";
import { AdminTeamSkeleton } from "@/components/admin/AdminMediaSkeleton";
import { useAdminAction } from "@/components/admin/AdminActionProvider";

type Member = {
  id: string;
  email: string;
  role: AdminRole;
  pendingInvite: boolean;
};

type InviteResult = {
  success: boolean;
  message?: string;
  inviteUrl?: string;
  email?: string;
};

function CopyInviteBox({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
      <p className="text-amber-100">
        We couldn&apos;t email the invite. Copy this link and send it to them directly:
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={url}
          className="min-w-0 flex-1 border border-white/10 bg-black px-2 py-2 text-xs text-white/80"
        />
        <button
          type="button"
          className="shrink-0 bg-white px-3 py-2 text-xs text-black"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

export default function TeamPanel() {
  const { runAction } = useAdminAction();
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [manualInviteUrl, setManualInviteUrl] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/team");
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load team");
    }
    setMembers(result.data);
  };

  useEffect(() => {
    load()
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : "Failed to load team");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInviteResponse = async (result: InviteResult, clearEmail: boolean) => {
    if (result.inviteUrl) {
      setManualInviteUrl(result.inviteUrl);
    }
    if (!result.success) {
      setMessage(result.message || "Invite failed");
      await load();
      throw new Error(result.message || "Invite failed");
    }
    setManualInviteUrl("");
    setMessage(result.message || "Invite sent");
    if (clearEmail) setEmail("");
    await load();
  };

  const invite = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setManualInviteUrl("");
    try {
      await runAction(`Sending invite to ${email}`, async () => {
        const response = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const result: InviteResult = await response.json();
        await handleInviteResponse(result, true);
        return result;
      });
    } catch {
      /* message + manual link already set */
    }
  };

  const removeMember = async (member: Member) => {
    const label = member.pendingInvite
      ? `Remove invite for ${member.email}`
      : `Remove ${member.email} from team`;
    if (!window.confirm(`${label}?`)) return;

    setMessage("");
    try {
      await runAction(label, async () => {
        const response = await fetch("/api/admin/team", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: member.id }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Remove failed");
        }
        await load();
        setManualInviteUrl("");
        return result;
      });
      setMessage("Removed.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Remove failed");
    }
  };

  const resend = async (memberEmail: string) => {
    setMessage("");
    try {
      await runAction(`Resending invite to ${memberEmail}`, async () => {
        const response = await fetch("/api/admin/team/resend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: memberEmail }),
        });
        const result: InviteResult = await response.json();
        await handleInviteResponse(result, false);
        return result;
      });
    } catch {
      /* message + manual link already set */
    }
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={invite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="grid flex-1 gap-2 text-sm">
          Invite admin by email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="colleague@example.com"
            className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
          />
        </label>
        <button type="submit" className="bg-white px-5 py-3 text-sm text-black">
          Send invite
        </button>
      </form>

      {message && (
        <p className="mt-4 border border-white/10 bg-white/5 px-4 py-3 text-sm">{message}</p>
      )}

      {manualInviteUrl && <CopyInviteBox url={manualInviteUrl} />}

      <div className="mt-10 border border-white/10">
        {loading ? (
          <AdminTeamSkeleton />
        ) : members.length === 0 ? (
          <p className="px-4 py-8 text-white/40">No admins yet.</p>
        ) : (
          <ul>
            {members.map((member) => (
              <li
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 first:border-t-0"
              >
                <span>{member.email}</span>
                <span className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                  {member.role === "super_admin" && (
                    <span className="bg-white/10 px-2 py-1 text-white/80">Super admin</span>
                  )}
                  {member.pendingInvite && (
                    <>
                      <span className="bg-amber-500/20 px-2 py-1 text-amber-100">
                        Invite pending
                      </span>
                      <button
                        type="button"
                        onClick={() => resend(member.email)}
                        className="underline underline-offset-2 hover:text-white"
                      >
                        Resend / copy link
                      </button>
                    </>
                  )}
                  {member.role !== "super_admin" && (
                    <button
                      type="button"
                      onClick={() => removeMember(member)}
                      className="text-red-300/80 underline underline-offset-2 hover:text-red-200"
                    >
                      {member.pendingInvite ? "Cancel invite" : "Remove"}
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
