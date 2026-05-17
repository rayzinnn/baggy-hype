import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking models...");
  try {
    const config = await prisma.siteConfig.findUnique({
        where: { id: "singleton" }
    });
    console.log("Success:", config);
  } catch (e) {
    console.error("Error:", (e as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
