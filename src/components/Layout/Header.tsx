export default function Header() {
  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Timeline Editor
      </h1>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
          Export
        </button>
      </div>
    </div>
  )
}
