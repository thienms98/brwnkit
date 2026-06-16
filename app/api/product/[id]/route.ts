import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: +id
      }
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[PRODUCT_GET]: ", err);
    return NextResponse.json(
      { message: "Failed to get product" },
      { status: 500 }
    );
  }
}
