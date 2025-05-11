export default function PostPageSkeleton() {
  return (
    <main className="dark:bg-gray-700 animate-pulse">
      {/* Header */}
    <div className="flex flex-col justify-center gap-3 items-center h-30 lg:h-50 pattern dark:pattern">
        <div className="h-9 w-24 bg-white dark:bg-gray-400 rounded-br-lg rounded-tl-lg" />
        <div className="h-20 w-4/5 lg:w-1/4 bg-white dark:bg-gray-400" />
    </div> 

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-center gap-3 lg:gap-6 lg:p-2">
        
        {/* Left: Post Content */}
        <div className="flex flex-col justify-center gap-4 w-fit lg:w-130 bg-white dark:bg-gray-800 p-4 lg:p-7 rounded shadow-2xl">
          <div className="w-full h-[350px] bg-gray-300 rounded" />
          
          <div className="flex justify-between items-center px-7 py-2 bg-gray-100 w-[calc(100%+2rem)] ml-[-1rem] lg:w-[calc(100%+3.5rem)] lg:ml-[-1.75rem] dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-400 rounded-full" />
              <div>
                <div className="h-3 w-20 bg-gray-400 rounded mb-1" />
                <div className="h-2 w-16 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="h-6 w-14 bg-gray-300 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
            <div className="h-4 w-4/6 bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 rounded" />
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-4/6 bg-gray-300 rounded" />
            <div className="h-4 w-4/6 bg-gray-300 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-4 w-4/6 bg-gray-300 rounded" />
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="flex flex-col gap-3 w-full h-fit lg:w-80 bg-white dark:bg-gray-800 p-5 rounded shadow-2xl">
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="h-4 w-12 bg-gray-300 rounded" />
          </div>
          <div className="h-8 w-full bg-gray-300 rounded mt-4" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-4 w-1/2 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
