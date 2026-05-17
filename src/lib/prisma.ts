import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { createRequire } from "module";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  prismaDbReady?: boolean;
};

const databasePath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "baggy-hype.db")
    : path.join(process.cwd(), "prisma", "dev.db");

function ensureSqliteDatabase() {
  if (globalForPrisma.prismaDbReady) return;

  fs.mkdirSync(path.dirname(databasePath), { recursive: true });

  const require = createRequire(import.meta.url);
  const Database = require("better-sqlite3") as any;
  const db = new Database(databasePath);

  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS Category (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE,
      parentId TEXT,
      FOREIGN KEY (parentId) REFERENCES Category(id)
    );

    CREATE TABLE IF NOT EXISTS Product (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      description TEXT,
      price NUMERIC NOT NULL,
      promoPrice NUMERIC,
      cost NUMERIC,
      images TEXT NOT NULL,
      videos TEXT NOT NULL DEFAULT '[]',
      sizes TEXT NOT NULL,
      seoTitle TEXT,
      seoDescription TEXT,
      categoryId TEXT NOT NULL,
      isFeatured INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES Category(id)
    );

    CREATE TABLE IF NOT EXISTS ProductVariant (
      id TEXT PRIMARY KEY NOT NULL,
      productId TEXT NOT NULL,
      color TEXT NOT NULL,
      size TEXT NOT NULL,
      sku TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      price NUMERIC,
      promoPrice NUMERIC,
      cost NUMERIC,
      media TEXT NOT NULL DEFAULT '[]',
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Customer (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      document TEXT,
      address TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Order" (
      id TEXT PRIMARY KEY NOT NULL,
      shortId TEXT NOT NULL UNIQUE,
      customerId TEXT,
      customerName TEXT,
      customerEmail TEXT,
      customerPhone TEXT,
      customerDocument TEXT,
      customerAddress TEXT,
      couponCode TEXT,
      discount NUMERIC NOT NULL DEFAULT 0,
      subtotal NUMERIC NOT NULL DEFAULT 0,
      items TEXT NOT NULL,
      total NUMERIC NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customerId) REFERENCES Customer(id)
    );

    CREATE TABLE IF NOT EXISTS Coupon (
      id TEXT PRIMARY KEY NOT NULL,
      code TEXT NOT NULL UNIQUE,
      discountType TEXT NOT NULL,
      value NUMERIC NOT NULL DEFAULT 0,
      appliesTo TEXT NOT NULL DEFAULT 'STORE',
      categoryId TEXT,
      productId TEXT,
      usageLimit INTEGER,
      perCustomerLimit INTEGER,
      firstPurchaseOnly INTEGER NOT NULL DEFAULT 0,
      startsAt DATETIME,
      endsAt DATETIME,
      minCartValue NUMERIC,
      maxDiscount NUMERIC,
      includeShipping INTEGER NOT NULL DEFAULT 0,
      combinesWithPromos INTEGER NOT NULL DEFAULT 1,
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES Category(id),
      FOREIGN KEY (productId) REFERENCES Product(id)
    );

    CREATE TABLE IF NOT EXISTS AnalyticsEvent (
      id TEXT PRIMARY KEY NOT NULL,
      eventType TEXT NOT NULL,
      productId TEXT,
      metadata TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS AdminUser (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS SiteConfig (
      id TEXT PRIMARY KEY NOT NULL DEFAULT 'singleton',
      topBannerText TEXT NOT NULL DEFAULT 'FRETE GRATIS EM PALMAS - TO / ENTREGA LOCAL',
      isBannerVisible INTEGER NOT NULL DEFAULT 1,
      whatsappNumber TEXT NOT NULL DEFAULT '5563999999999',
      heroImage1 TEXT NOT NULL DEFAULT '/post01.jpg',
      heroImage2 TEXT NOT NULL DEFAULT '/post01.jpg',
      heroImage3 TEXT NOT NULL DEFAULT '/post01.jpg',
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.close();
  globalForPrisma.prismaDbReady = true;
}

ensureSqliteDatabase();

const adapter = new PrismaBetterSqlite3({
  url: databasePath,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
