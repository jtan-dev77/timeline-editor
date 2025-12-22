import { useTimeline } from '../../contexts/TimelineContext'

export default function PropertiesPanel() {
  const { selectedClip, updateClip } = useTimeline()

  if (!selectedClip) {
    return (
      <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Properties
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Select a clip to edit its properties
        </div>
      </div>
    )
  }

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseFloat(e.target.value)
    updateClip(selectedClip.id, { opacity })
  }

  const handleAudioLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioLevel = parseFloat(e.target.value)
    updateClip(selectedClip.id, { audioLevel })
  }

  const handleTextContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    updateClip(selectedClip.id, {
      media: {
        ...selectedClip.media,
        content: newContent,
      },
    })
  }

  const handleTextStyleChange = (field: string, value: string | number | boolean) => {
    const currentStyle = selectedClip.textStyle || {
      fontSize: 24,
      color: '#FFFFFF',
      fontFamily: 'Arial',
      alignment: 'center' as const,
      bold: false,
      italic: false,
    }
    updateClip(selectedClip.id, {
      textStyle: {
        ...currentStyle,
        [field]: value,
      },
    })
  }

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Properties
      </h2>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Clip Name
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {selectedClip.media.name}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Duration
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {(selectedClip.endTime - selectedClip.startTime).toFixed(2)}s
        </p>
      </div>

      {selectedClip.media.type === 'text' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Content
          </label>
          <textarea
            value={selectedClip.media.content || ''}
            onChange={handleTextContentChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm resize-none"
            placeholder="Enter text content..."
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opacity: {selectedClip.opacity ?? 100}%
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={selectedClip.opacity ?? 100}
              onChange={handleOpacityChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {(selectedClip.media.type === 'audio' || selectedClip.media.type === 'video') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audio Level: {selectedClip.audioLevel ?? 100}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="200"
                value={selectedClip.audioLevel ?? 100}
                onChange={handleAudioLevelChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span>200%</span>
              </div>
            </div>
          </div>
        )}

        {selectedClip.media.type === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size: {selectedClip.textStyle?.fontSize ?? 24}px
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={selectedClip.textStyle?.fontSize ?? 24}
                  onChange={(e) => handleTextStyleChange('fontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>12px</span>
                  <span>72px</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={selectedClip.textStyle?.color ?? '#FFFFFF'}
                onChange={(e) => handleTextStyleChange('color', e.target.value)}
                className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Family
              </label>
              <select
                value={selectedClip.textStyle?.fontFamily ?? 'Arial'}
                onChange={(e) => handleTextStyleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alignment
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTextStyleChange('alignment', 'left')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedClip.textStyle?.alignment === 'left'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Left
                </button>
                <button
                  onClick={() => handleTextStyleChange('alignment', 'center')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedClip.textStyle?.alignment === 'center'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Center
                </button>
                <button
                  onClick={() => handleTextStyleChange('alignment', 'right')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedClip.textStyle?.alignment === 'right'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Right
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedClip.textStyle?.bold ?? false}
                  onChange={(e) => handleTextStyleChange('bold', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Bold</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedClip.textStyle?.italic ?? false}
                  onChange={(e) => handleTextStyleChange('italic', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Italic</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
