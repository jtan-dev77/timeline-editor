import { useState, useCallback, useEffect } from 'react'
import type { MediaFile } from '../../types/media'
import { getMediaType, generateMediaId } from '../../utils/fileUtils'
import UploadArea from './UploadArea'
import MediaItem from './MediaItem'

export default function MediaPanel() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

  useEffect(() => {
    return () => {
      mediaFiles.forEach((media) => {
        URL.revokeObjectURL(media.url)
        if (media.thumbnail && media.thumbnail !== media.url) {
          URL.revokeObjectURL(media.thumbnail)
        }
      })
    }
  }, [mediaFiles])

  const handleFilesSelected = useCallback((files: File[]) => {
    const newMediaFiles: MediaFile[] = files.map((file) => {
      const mediaType = getMediaType(file)
      if (!mediaType) return null

      const url = URL.createObjectURL(file)
      const mediaFile: MediaFile = {
        id: generateMediaId(),
        name: file.name,
        type: mediaType,
        file,
        url,
        size: file.size,
      }

      if (mediaType === 'image') {
        mediaFile.thumbnail = url
      }

      return mediaFile
    }).filter((media): media is MediaFile => media !== null)

    setMediaFiles((prev) => [...prev, ...newMediaFiles])
  }, [])

  const handleMediaSelect = (media: MediaFile) => {
    console.log('Selected media:', media)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Media
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <UploadArea onFilesSelected={handleFilesSelected} />

        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Media
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

