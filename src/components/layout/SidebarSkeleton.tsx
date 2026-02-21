/* ---------------- Skeleton Loader ---------------- */
const SkeletonLoader = () => (
  <div className="space-y-3 px-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    ))}
  </div>
);
export default function SidebarSkeleton() {
  return (
    <div className="p-4">
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
    </div>
  );
}
