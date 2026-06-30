import { ROLE } from "@/generated/prisma/enums";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sleep } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || 1;

  const products = await prisma.product.findMany({
    take: 12,
    skip: +page - 1
  });

  const count = await prisma.product.count();

  return NextResponse.json({ products, pagination: { total: count, page } });
}

export async function POST(req: NextRequest) {
  await sleep(10000);
  try {
    const { role } = getAuth(req);
    if (role !== ROLE.ADMIN) throw new Error("Unauthorized");

    const { title, price, thumbnail } = (await req.json()) as {
      title: string;
      thumbnail: string;
      price: number;
    };

    const slug = slugify(title, {
      lower: true,
      trim: true,
      replacement: "-"
    });

    const product = await prisma.product.create({
      data: {
        title,
        thumbnail,
        slug,
        price
      }
    });

    return NextResponse.json(
      { message: "Product created", product },
      { status: 201 }
    );
  } catch (err) {
    console.error("[PRODUCT_CREATE]: ", err);

    return NextResponse.json(
      { message: "Product create failed" },
      { status: 500 }
    );
  }
}
