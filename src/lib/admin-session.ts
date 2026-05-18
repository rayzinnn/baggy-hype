export const adminAccessCookieName = "bh_sb_access";
export const adminRefreshCookieName = "bh_sb_refresh";

type CookieGetter = { get(name: string): { value: string } | undefined };

export function hasAdminAuthCookies(cookies: CookieGetter) {
  const access = cookies.get(adminAccessCookieName)?.value;
  const refresh = cookies.get(adminRefreshCookieName)?.value;
  return Boolean(access && refresh);
}
