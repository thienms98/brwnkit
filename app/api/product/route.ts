import { ROLE } from "@/generated/prisma/enums";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || 0;

  const products = await prisma.product.findMany({
    take: 1,
    skip: +page
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  try {
    const { role } = getAuth(req);
    if (role !== ROLE.ADMIN) throw new Error("Unauthorized");

    const { title, price } = (await req.json()) as {
      title: string;
      price: number;
    };

    const slug = slugify(title, {
      lower: true,
      trim: true,
      replacement: "-"
    });

    await prisma.product.create({
      data: {
        title,
        slug,
        price
      }
    });

    return NextResponse.json({ message: "Product created" }, { status: 201 });
  } catch (err) {
    console.error("[PRODUCT_CREATE]: ", err);

    return NextResponse.json(
      { message: "Product create failed" },
      { status: 500 }
    );
  }
}
