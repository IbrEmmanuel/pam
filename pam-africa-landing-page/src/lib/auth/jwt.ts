import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "pam_admin_token";
export const JWT_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminToken = {
  sub: string;
  email: string;
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: AdminToken) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${JWT_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminToken | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: JWT_MAX_AGE,
  };
}
