export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`skeleton ${className}`}
    aria-hidden="true"
    {...props}
  />
);

export const ReportSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Header skeleton */}
    <div className="card p-6">
      <div className="flex items-start gap-6">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48 rounded" />
          <Skeleton className="h-5 w-64 rounded" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="w-24 h-24 rounded-2xl" />
      </div>
    </div>

    {/* Scores skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="card p-6 space-y-4">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      ))}
    </div>

    {/* Skills skeleton */}
    <div className="card p-6">
      <Skeleton className="h-6 w-32 rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-8 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

export const HistorySkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="card p-5 flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);


