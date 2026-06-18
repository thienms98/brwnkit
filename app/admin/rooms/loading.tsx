import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded-md bg-muted/80" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-32 w-full animate-pulse bg-muted" />

            <CardHeader className="space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
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
    </div>
  );
}
