export default function PostSkeleton() {
  return (
    <div className="animate-pulse border-4 border-gray-600 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="h-3 w-20 bg-gray-300 rounded" />
        <div className="flex items-center gap-1">
          <div className="h-3 w-4 bg-gray-300 rounded" />
          <div className="h-3 w-6 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-24 bg-gray-300 rounded" />
          <div className="h-4 w-40 bg-gray-400 rounded" />
        </div>
        <div className="w-7 h-7 bg-gray-300 rounded-full" />
      </div>
      <div className="h-12 bg-gray-200 rounded mb-2" />
      <div className="w-full h-[150px] bg-gray-300 rounded-lg mb-2" />
      <div className="flex justify-between items-center">
        <div className="h-3 w-16 bg-gray-300 rounded" />
        <div className="h-6 w-12 bg-gray-400 rounded-lg" />
      </div>
    </div>
  );
}
