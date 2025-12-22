import { useState, useCallback, useEffect } from 'react'
import type { MediaFile } from '../../types/media'
import { getMediaType, generateMediaId } from '../../utils/fileUtils'
import UploadArea from './UploadArea'
import MediaItem from '../MediaPanel/MediaItem'

export default function TextPanel() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

  useEffect(() => {
    return () => {
      mediaFiles.forEach((media) => {
        URL.revokeObjectURL(media.url)
      })
    }
  }, [mediaFiles])

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newMediaFiles = await Promise.all(
      files.map(async (file) => {
        const mediaType = getMediaType(file)
        if (mediaType !== 'text') return null

        const url = URL.createObjectURL(file)
        const content = await file.text()
        
        const mediaFile: MediaFile = {
          id: generateMediaId(),
          name: file.name,
          type: 'text',
          file,
          url,
          size: file.size,
          content,
        }

        return mediaFile
      })
    )

    const validFiles = newMediaFiles.filter((media): media is MediaFile => media !== null)
    setMediaFiles((prev) => [...prev, ...validFiles])
  }, [])

  const handleMediaSelect = (media: MediaFile) => {
    console.log('Selected text:', media)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <UploadArea onFilesSelected={handleFilesSelected} />

        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Files
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

