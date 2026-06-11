import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const salt = await bcrypt.genSalt(11);
  const hash = await bcrypt.hash("123123", salt);

  const admin = await prisma.account.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin",
      password: hash,
      role: "ADMIN"
    }
  });

  const product = await prisma.product.create({
    data: {
      title: "Gaming Chair X1",
      price: 532.5,
      slug: "gaming-chair-x1"
    }
  });

  const parts = await prisma.productPart.createMany({
    data: [
      {
        title: "seat",
        productId: product.id,
        partName: "seat"
      },
      {
        title: "legs",
        productId: product.id,
        partName: "legs"
      }
    ]
  });

  console.log({ admin, product, parts });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
