/** Strip trailing slash for consistent link building. */
export function normalizeSiteUrl(url: string) {
  return url.replace(/\/$/, "");
}

function isLocalhostUrl(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Server: best public origin for emails, invites, OG URLs. */
export function getSiteUrlFromRequest(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost?.split(",")[0]?.trim() || request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (host && isLocalhostUrl(host) ? "http" : "https");

  if (host) {
    const fromRequest = normalizeSiteUrl(`${proto}://${host}`);
    if (!isLocalhostUrl(fromRequest)) {
      if (configured && !isLocalhostUrl(configured)) {
        return normalizeSiteUrl(configured);
      }
      return fromRequest;
    }
  }

  if (process.env.VERCEL_URL) {
    return normalizeSiteUrl(`https://${process.env.VERCEL_URL}`);
  }

  if (configured) {
    return normalizeSiteUrl(configured);
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return normalizeSiteUrl(origin);
  }

  return "http://localhost:3000";
}

/** Server components / scripts without a Request. */
export function getDefaultSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configured) return normalizeSiteUrl(configured);
  if (process.env.VERCEL_URL) {
    return normalizeSiteUrl(`https://${process.env.VERCEL_URL}`);
  }
  return "https://www.pamafrica.com";
}
