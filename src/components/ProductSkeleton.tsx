export default function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-[#111111] aspect-[3/4] rounded-sm mb-4" />
      <div className="px-1 space-y-2">
        <div className="h-2 bg-[#1a1a1a] rounded w-1/3" />
        <div className="h-3 bg-[#1a1a1a] rounded w-3/4" />
        <div className="h-3 bg-[#1a1a1a] rounded w-1/4 ml-auto" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
