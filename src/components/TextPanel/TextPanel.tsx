import { useState, useCallback, useEffect } from 'react'
import type { MediaFile } from '../../types/media'
import { generateMediaId } from '../../utils/fileUtils'
import MediaItem from '../MediaPanel/MediaItem'

export default function TextPanel() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

  useEffect(() => {
    return () => {
      mediaFiles.forEach((media) => {
        if (media.url) {
          URL.revokeObjectURL(media.url)
        }
      })
    }
  }, [mediaFiles])

  const handleCreateTextOverlay = useCallback(() => {
    const textMedia: MediaFile = {
      id: generateMediaId(),
      name: `Text Overlay ${mediaFiles.length + 1}`,
      type: 'text',
      file: new File(['Enter your text here'], 'text-overlay.txt', { type: 'text/plain' }),
      url: '',
      size: 0,
      duration: 5,
      content: 'Enter your text here',
    }
    setMediaFiles((prev) => [...prev, textMedia])
  }, [mediaFiles.length])

  const handleMediaSelect = (media: MediaFile) => {
    console.log('Selected text:', media)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <button
          onClick={handleCreateTextOverlay}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Text Overlay
        </button>

        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Text Overlays
            </h3>
            <div className="space-y-1">
              {mediaFiles.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  onSelect={handleMediaSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

