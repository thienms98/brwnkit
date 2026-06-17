import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || 1;
  const q = req.nextUrl.searchParams.get("q");

  try {
    const rooms = await prisma.room.findMany({
      take: 12,
      skip: (+page - 1) * 12
    });

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("[GET ROOMS: ]", err);
    return NextResponse.json(
      { message: "Failed to get rooms" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const {
    title,
    url,
    objects = []
  } = (await req.json()) as {
    title: string;
    url: string;
    objects: [
      {
        name: string;
        productId: number;
        hotspot: {
          x: number;
          y: number;
          z: number;
        };
      }
    ];
  };
  const slug = slugify(title);

  try {
    const rooms = await prisma.room.create({
      data: {
        title,
        slug,
        url,
        roomObjects: {
          createMany: {
            data: objects
          }
        }
      }
    });

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("[GET ROOMS: ]", err);
    return NextResponse.json(
      { message: "Failed to get rooms" },
      { status: 500 }
    );
  }
}
