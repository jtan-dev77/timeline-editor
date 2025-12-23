import { useState, useCallback } from 'react'
import type { MediaFile } from '../../types/media'
import { getMediaType, generateMediaId, isValidVideoFile } from '../../utils/fileUtils'
import { getMediaDuration } from '../../utils/mediaDuration'
import { useMediaCleanup } from '../../hooks/useMediaCleanup'
import UploadArea from '../Shared/UploadArea'
import MediaItem from '../Shared/MediaItem'
import { SUPPORTED_VIDEO_TYPES } from '../../types/media'

export default function VideoPanel() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

  useMediaCleanup(mediaFiles)

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newMediaFiles = await Promise.all(
      files.map(async (file) => {
        const mediaType = getMediaType(file)
        if (mediaType !== 'video') return null

        const url = URL.createObjectURL(file)
        const duration = await getMediaDuration(file, 'video')
        
        const mediaFile: MediaFile = {
          id: generateMediaId(),
          name: file.name,
          type: 'video',
          file,
          url,
          size: file.size,
          duration,
        }

        return mediaFile
      })
    )

    const validFiles = newMediaFiles.filter((media): media is MediaFile => media !== null)
    setMediaFiles((prev) => [...prev, ...validFiles])
  }, [])

  const handleMediaSelect = (media: MediaFile) => {
    console.log('Selected video:', media)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <UploadArea 
          onFilesSelected={handleFilesSelected}
          accept={SUPPORTED_VIDEO_TYPES.join(',')}
          supportedFormats="MP4, MOV"
          validateFile={isValidVideoFile}
        />

        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Videos
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

