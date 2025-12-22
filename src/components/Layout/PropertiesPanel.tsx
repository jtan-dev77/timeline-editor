export default function PropertiesPanel() {
  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Compositing
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opacity
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="100"
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Additional properties will appear here
      </div>
    </div>
  )
}

