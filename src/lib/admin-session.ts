export const adminSessionCookieName = "baggy_admin_session";

const fallbackAdminEmail = "admin@baggyhype.club";
const fallbackAdminPassword = "baggy2026";
const fallbackAdminSessionToken = "baggy-hype-temporary-admin-session";

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || process.env.AUTH_SECRET || fallbackAdminSessionToken;
}

export function isValidAdminSessionToken(value?: string) {
  return value === getAdminSessionToken();
}

export function validateAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || fallbackAdminEmail;
  const adminPassword = process.env.ADMIN_PASSWORD || fallbackAdminPassword;

  return email === adminEmail && password === adminPassword;
}
