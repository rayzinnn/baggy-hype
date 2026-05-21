import { prisma } from "@/lib/prisma";

export async function isAdminEmail(email: string | null | undefined) {
  const normalizedEmail = email?.trim();
  if (!normalizedEmail) return false;

  const admin = await prisma.adminUser.findFirst({
    where: {
      email: {
        equals: normalizedEmail,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  return Boolean(admin);
}
