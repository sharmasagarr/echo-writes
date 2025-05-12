export default function PostSkeleton() {
  return (
    <div className="border-4 border-gray-600 p-4 rounded-lg shadow-lg animate-pulse dark:border-gray-700">
      {/* Date and Views Placeholder */}
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-300 rounded w-1/4 dark:bg-gray-600"></div>
        <div className="flex items-center gap-1">
           {/* Eye icon placeholder */}
          <div className="h-4 w-4 bg-gray-300 rounded-full dark:bg-gray-600"></div>
          <div className="h-3 bg-gray-300 rounded w-8 dark:bg-gray-600"></div>
        </div>
      </div>

      {/* Author and Title Placeholder */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex flex-col w-3/4">
          {/* Author Name Placeholder */}
          <div className="h-3 bg-gray-300 rounded w-1/3 mb-1 dark:bg-gray-600"></div>
          {/* Title Placeholder */}
          <div className="h-5 bg-gray-300 rounded w-2/3 dark:bg-gray-600"></div>
        </div>
        {/* Author Image Placeholder */}
        <div className="w-7 h-7 bg-gray-300 rounded-full dark:bg-gray-600"></div>
      </div>

      {/* Description Placeholder */}
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-gray-300 rounded w-full dark:bg-gray-600"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6 dark:bg-gray-600"></div>
        <div className="h-3 bg-gray-300 rounded w-4/5 dark:bg-gray-600"></div>
      </div>

      {/* Post Image Placeholder */}
      <div className="w-full aspect-[8/3] border-2 bg-gray-300 rounded-lg mt-3 dark:bg-gray-600"></div>

      {/* Category and Read Button Placeholder */}
      <div className="flex justify-between items-center mt-3">
        {/* Category Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-600"></div>
        {/* Read Button Placeholder */}
        <div className="h-6 w-16 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
      </div>
    </div>
  );
}