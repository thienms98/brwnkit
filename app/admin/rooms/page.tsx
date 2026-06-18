import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";
import { Room } from "@/generated/prisma/client";
import req from "@/lib/req";

const RoomPage = async ({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const {
    data: { rooms }
  } = await req.get<{ rooms: Room[] }>("/room");

  return (
    <div className="py-3 px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Rooms</h1>
        <Link
          href="/admin/rooms/add"
          className={cn(
            buttonVariants(),
            "flex items-center gap-2 cursor-pointer"
          )}
        >
          <PlusIcon size={14} /> Add new room
        </Link>
      </div>
      <div className="py-3 px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((prod) => (
            <Link href={`/admin/rooms/${prod.id}`} key={prod.id}>
              <Card className="overflow-hidden">
                <div className="h-32 w-full animate-pulse bg-muted" />

                <CardHeader className="space-y-3">
                  <div className="font-semibold text-xl">{prod.title}</div>
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted/80" />
                </CardHeader>

                <CardContent className="space-y-3 pb-4">
                  <div className="h-3 w-full animate-pulse rounded bg-muted/70" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-muted/70" />

                  <div className="flex items-center justify-between pt-2">
                    <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default RoomPage;
