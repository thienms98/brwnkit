import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; name: string }> }
) {
  try {
    const { id, name } = await params;
    const { productId } = (await req.json()) as { productId: number };

    await prisma.roomObject.upsert({
      where: {
        roomId_name: {
          roomId: +id,
          name
        }
      },
      create: {
        name,
        roomId: +id,
        productId
      },
      update: {
        productId
      }
    });

    return NextResponse.json({ message: "success" });
  } catch {
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
