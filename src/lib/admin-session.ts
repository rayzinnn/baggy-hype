export const adminSessionCookieName = "baggy_admin_session";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || getRequiredEnv("AUTH_SECRET");
}

export function isValidAdminSessionToken(value?: string) {
  return value === getAdminSessionToken();
}

export function validateAdminCredentials(email: string, password: string) {
  const adminEmail = getRequiredEnv("ADMIN_EMAIL");
  const adminPassword = getRequiredEnv("ADMIN_PASSWORD");

  return email === adminEmail && password === adminPassword;
}
