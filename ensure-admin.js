const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

async function main() {
  const db = new Database("prisma/dev.db");
  const adapter = new PrismaBetterSqlite3(db);
  const prisma = new PrismaClient({ adapter });

  console.log("Checking DB...");
  const users = await prisma.adminUser.findMany();
  console.log("Current Users:", users.map(u => u.email));

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

  console.log("Admin OK: admin@baggyhype.club / baggy2026");
  await prisma.$disconnect();
}

main().catch(err => {
    console.error("FATAL ERROR:", err);
    process.exit(1);
});
