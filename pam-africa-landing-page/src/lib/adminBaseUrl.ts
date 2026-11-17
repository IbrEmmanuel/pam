import { getSiteUrlFromRequest } from "@/lib/siteUrl";

export function getAdminBaseUrl(request: Request) {
  return getSiteUrlFromRequest(request);
}
