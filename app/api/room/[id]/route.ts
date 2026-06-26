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
        roomObjects: {
          include: {
            product: true
          }
        }
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { watchers, objects = [] } = await req.json();

    const roomId = +id;

    const existing = await prisma.roomObject.findMany({
      where: { roomId },
      select: { name: true, productId: true }
    });

    const toDelete = existing.filter(
      (e) => !objects.find((o: any) => o.name === e.name)
    );
    const toCreate = objects.filter(
      (o: any) => !existing.find((e) => e.name === o.name)
    );

    await prisma.$transaction([
      prisma.room.update({
        where: { id: roomId },
        data: { watchers }
      }),
      prisma.roomObject.deleteMany({
        where: { roomId, name: { in: toDelete.map((e) => e.name) } }
      }),
      prisma.roomObject.createMany({
        data: toCreate.map((o: any) => ({
          roomId,
          name: o.name,
          productId: o.productId
        }))
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`[UPDATE ROOM ${id}]: `, err.message);
    return NextResponse.json(
      { message: "Failed to get room" },
      { status: 500 }
    );
  }
}
