import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'

const db = new Database('prisma/dev.db')
const adapter = new PrismaBetterSqlite3(db)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = "admin@baggyhype.club"
  const password = "baggy2026"
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.adminUser.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
