const EditProfileFormSkeleton = () => {
  return (
    <form>
      {/* Name Input Skeleton */}
      <div className="mb-5">
        <div className="block h-4 w-1/4 mb-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div> {/* Label skeleton */}
        <div className="shadow-sm border rounded-lg w-full h-12 bg-gray-100 dark:bg-gray-700 animate-pulse"></div> {/* Input field skeleton */}
      </div>

      {/* Image Input Skeleton */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="block h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div> {/* Label skeleton */}
          <div className="h-3 w-1/6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div> {/* Max size text skeleton */}
        </div>

        <div className="flex items-center justify-between">
          <div className="block w-full h-10 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse"></div> {/* File input skeleton */}
          <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse ml-2"></div> {/* X button skeleton */}
        </div>

        {/* Image Preview Skeleton */}
        <div className="border rounded-lg flex justify-center items-center shadow-sm p-2 mt-2">
          <div className="w-40 h-40 border rounded-full bg-gray-100 dark:bg-gray-700 flex justify-center items-center shadow-sm overflow-hidden animate-pulse">
          </div>
        </div>
      </div>

      {/* Bio Input Skeleton */}
      <div className="mb-5">
        <div className="block h-4 w-1/4 mb-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div> {/* Label skeleton */}
        <div className="shadow-sm border rounded-lg w-full h-24 bg-gray-100 dark:bg-gray-700 animate-pulse"></div> {/* Textarea skeleton */}
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex items-center justify-center mt-6">
        <div
          className="flex justify-center items-center bg-blue-600/50 w-4/6 text-sm lg:text-[20px] lg:w-1/2 h-10 lg:h-12 rounded-full animate-pulse"
        ></div> {/* Button skeleton */}
      </div>
    </form>
  );
}

export default EditProfileFormSkeleton;