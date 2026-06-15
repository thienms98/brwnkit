import { Product } from "@/generated/prisma/client";
import req from "@/lib/req";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AdminProducts = async ({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const page = (await searchParams).page;
  const pageParam = page ? `page=${page}` : "";
  const {
    data: { products }
  } = await req.get<{
    products: Product[];
    pagination: { page: number; total: number };
  }>(`/product?${pageParam}`);

  return (
    <div className="py-3 px-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((prod) => (
          <Card key={prod.id} className="overflow-hidden">
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
        ))}
      </div>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
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
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AdminProducts;
