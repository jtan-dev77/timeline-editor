export default function Timeline() {
  return (
    <div className="h-32 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 relative">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-600 z-10">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
      </div>
    </div>
  )
}

