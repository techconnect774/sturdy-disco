export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 dark:border-gray-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse opacity-30"></div>
      </div>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading...</span>
    </div>
  );
}
