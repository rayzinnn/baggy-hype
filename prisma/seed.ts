import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@baggyhype.club";
  const password = "baggy2026";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
