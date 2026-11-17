import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PAM_AFRICA_USERS } from "@/lib/supabase/tables";
import {
  createResetToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "./password";

export type AdminRole = "super_admin" | "admin";

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: AdminRole;
  reset_token_hash: string | null;
  reset_token_expires: string | null;
  invite_token_hash: string | null;
  invite_expires: string | null;
};

export type TeamMember = {
  id: string;
  email: string;
  role: AdminRole;
  pendingInvite: boolean;
  createdAt?: string;
};

const USER_COLUMNS =
  "id, email, password_hash, role, reset_token_hash, reset_token_expires, invite_token_hash, invite_expires";

export async function countUsers() {
  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from(PAM_AFRICA_USERS)
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function findUserByEmail(email: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(PAM_AFRICA_USERS)
    .select(USER_COLUMNS)
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as UserRow | null) ?? null;
}

export async function findUserById(id: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(PAM_AFRICA_USERS)
    .select(USER_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as UserRow | null) ?? null;
}

export async function createUser(
  email: string,
  password: string,
  role: AdminRole = "admin"
) {
  const supabase = createSupabaseAdminClient();
  const normalized = email.toLowerCase().trim();
  const bootstrap = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const resolvedRole: AdminRole =
    role === "super_admin" || normalized === bootstrap ? "super_admin" : "admin";

  const { data, error } = await supabase
    .from(PAM_AFRICA_USERS)
    .insert({
      email: normalized,
      password_hash: await hashPassword(password),
      role: resolvedRole,
    })
    .select("id, email, role")
    .single();
  if (error) throw new Error(error.message);
  return data as { id: string; email: string; role: AdminRole };
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  if (user.invite_token_hash) return null;
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return null;
  return { id: user.id, email: user.email, role: user.role ?? "admin" };
}

export async function startPasswordReset(email: string) {
  const user = await findUserByEmail(email);
  if (!user || user.invite_token_hash) return null;

  const token = createResetToken();
  const supabase = createSupabaseAdminClient();
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const { error } = await supabase
    .from(PAM_AFRICA_USERS)
    .update({
      reset_token_hash: hashToken(token),
      reset_token_expires: expires,
    })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  return { email: user.email, token };
}

export async function resetPasswordWithToken(token: string, password: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(PAM_AFRICA_USERS)
    .select("id, reset_token_expires")
    .eq("reset_token_hash", hashToken(token))
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return false;

  const expires = data.reset_token_expires
    ? new Date(data.reset_token_expires).getTime()
    : 0;
  if (!expires || expires < Date.now()) return false;

  const { error: updateError } = await supabase
    .from(PAM_AFRICA_USERS)
    .update({
      password_hash: await hashPassword(password),
      reset_token_hash: null,
      reset_token_expires: null,
    })
    .eq("id", data.id);
  if (updateError) throw new Error(updateError.message);
  return true;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await findUserById(userId);
  if (!user) return { ok: false as const, reason: "not_found" as const };
  const valid = await verifyPassword(currentPassword, user.password_hash);
  if (!valid) return { ok: false as const, reason: "invalid_password" as const };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(PAM_AFRICA_USERS)
    .update({ password_hash: await hashPassword(newPassword) })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function listTeamMembers(): Promise<TeamMember[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(PAM_AFRICA_USERS)
    .select("id, email, role, invite_token_hash, created_at")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    email: row.email as string,
    role: (row.role as AdminRole) ?? "admin",
    pendingInvite: Boolean(row.invite_token_hash),
    createdAt: row.created_at as string | undefined,
  }));
}

export async function refreshInvitedAdmin(email: string) {
  const normalized = email.toLowerCase().trim();
  const existing = await findUserByEmail(normalized);
  if (!existing?.invite_token_hash) {
    throw new Error("No pending invite for this email");
  }

  const token = createResetToken();
  const supabase = createSupabaseAdminClient();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase
    .from(PAM_AFRICA_USERS)
    .update({
      invite_token_hash: hashToken(token),
      invite_expires: expires,
    })
    .eq("id", existing.id);
  if (error) throw new Error(error.message);

  return { user: { id: existing.id, email: existing.email }, token };
}

export async function createOrRefreshInvitedAdmin(email: string) {
  const normalized = email.toLowerCase().trim();
  const existing = await findUserByEmail(normalized);
  if (existing) {
    if (existing.invite_token_hash) {
      return refreshInvitedAdmin(normalized);
    }
    throw new Error("An active admin account already exists for this email");
  }
  return createInvitedAdmin(normalized);
}

async function createInvitedAdmin(email: string) {
  const normalized = email.toLowerCase().trim();

  const token = createResetToken();
  const supabase = createSupabaseAdminClient();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const placeholder = createResetToken() + createResetToken();

  const { data, error } = await supabase
    .from(PAM_AFRICA_USERS)
    .insert({
      email: normalized,
      password_hash: await hashPassword(placeholder),
      role: "admin",
      invite_token_hash: hashToken(token),
      invite_expires: expires,
    })
    .select("id, email")
    .single();
  if (error) throw new Error(error.message);

  return { user: data as { id: string; email: string }, token };
}

export async function removeTeamMember(
  targetId: string,
  actor: { id: string; role: AdminRole }
) {
  if (actor.role !== "super_admin") {
    throw new Error("Only the super admin can remove team members");
  }
  if (targetId === actor.id) {
    throw new Error("You cannot remove your own account");
  }

  const target = await findUserById(targetId);
  if (!target) {
    throw new Error("User not found");
  }
  if (target.role === "super_admin") {
    throw new Error("Super admin accounts cannot be removed from here");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from(PAM_AFRICA_USERS).delete().eq("id", targetId);
  if (error) throw new Error(error.message);
}

export async function acceptInviteWithPassword(token: string, password: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(PAM_AFRICA_USERS)
    .select("id, invite_expires")
    .eq("invite_token_hash", hashToken(token))
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return false;

  const expires = data.invite_expires
    ? new Date(data.invite_expires).getTime()
    : 0;
  if (!expires || expires < Date.now()) return false;

  const { error: updateError } = await supabase
    .from(PAM_AFRICA_USERS)
    .update({
      password_hash: await hashPassword(password),
      invite_token_hash: null,
      invite_expires: null,
    })
    .eq("id", data.id);
  if (updateError) throw new Error(updateError.message);
  return true;
}

export function canUseCustomAuth() {
  return isSupabaseConfigured() && Boolean(process.env.JWT_SECRET);
}
