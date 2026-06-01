interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
  const radiusMap = {
    sm: "rounded-[var(--radius-sm)]",
    md: "rounded-[var(--radius-md)]",
    lg: "rounded-[var(--radius-lg)]",
    full: "rounded-full",
  };

  return (
    <div
      className={`skeleton-shimmer bg-[var(--neutral-100)] ${radiusMap[rounded]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="block">
      <Skeleton className="aspect-[3/4] w-full" rounded="lg" />
      <div className="pt-5 pb-2 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function PDPSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full" rounded="lg" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 flex-shrink-0" />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="space-y-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-12 w-full" rounded="full" />
        </div>
      </div>
    </div>
  );
}

export function PLPSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-10 w-64 mx-auto mb-2" />
      <Skeleton className="h-4 w-96 mx-auto mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
