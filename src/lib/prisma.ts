import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

// P7 + Windows stable initialization
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Usamos o Better-SQLite3 para garantir que o Turbopack/Next.js não tenha problemas de engine binária
// O segredo no Windows com caminhos com espaço é usar o Database instance direta.
const db = new Database(path.join(process.cwd(), "prisma", "dev.db"));
const adapter = new PrismaBetterSqlite3(db);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
