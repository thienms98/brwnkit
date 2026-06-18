import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const room = await prisma.room.findFirstOrThrow({
      where: {
        OR: [
          {
            id: +id
          },
          {
            slug: id
          }
        ]
      },
      include: {
        roomObjects: true
      }
    });

    return NextResponse.json({ room });
  } catch (err: any) {
    console.error("[QUERY ROOM]: ", err.message);
    return NextResponse.json(
      { message: "Failed to get room" },
      { status: 500 }
    );
  }
}
