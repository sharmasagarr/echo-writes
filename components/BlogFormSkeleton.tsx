const BlogFormSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Title Input Skeleton */}
      <div className="mb-5">
        <div className="block h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2"></div> {/* Label placeholder */}
        <div className="shadow-sm border rounded-lg w-full py-3 px-4 h-12 bg-gray-300 dark:bg-gray-700"></div> {/* Input field placeholder */}
      </div>

      {/* Category Input Skeleton */}
      <div className="mb-5">
         {/* This structure assumes CategoryInput has a similar label and input-like structure */}
         <div className="block h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div> {/* Label placeholder */}
         <div className="shadow-sm border rounded-lg w-full py-3 px-4 h-12 bg-gray-300 dark:bg-gray-700"></div> {/* Category input placeholder */}
      </div>

      {/* Image Input Skeleton */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="block h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div> {/* Label placeholder */}
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-40"></div> {/* Info text placeholder */}
        </div>

        <div className="flex items-center justify-between">
          {/* File input area placeholder */}
          <div className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold h-10 bg-gray-300 dark:bg-gray-700 rounded-full lg:w-3/4"></div>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full ml-2"></div>
        </div>
        {/* Placeholder for image preview */}
         <div className="border rounded-lg flex justify-center items-center mt-2 shadow-sm bg-gray-300 dark:bg-gray-700 aspect-video w-full h-40"></div>
      </div>

      {/* MD Editor Input Skeleton */}
      <div className="mb-5"> 
         <div className="block h-4 bg-gray-300 dark:bg-gray-700 rounded w-28 mb-2"></div> {/* Label placeholder */}
         {/* MDEditor area placeholder with fixed height */}
         <div className="shadow-lg border rounded-lg overflow-hidden w-full h-[500px] bg-gray-300 dark:bg-gray-700"></div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex items-center justify-center mt-6">
        <div className="flex justify-center items-center bg-gray-300 dark:bg-gray-700 w-4/6 text-sm lg:text-[20px] lg:w-1/2 font-bold py-2 px-4 lg:py-3 lg:px-6 rounded-full h-12 lg:h-14">
        </div>
      </div>
    </div>
  );
};

export default BlogFormSkeleton;