import { useState, useCallback } from 'react'
import type { MediaFile } from '../../types/media'
import { getMediaType, generateMediaId, isValidAudioFile } from '../../utils/fileUtils'
import { getMediaDuration } from '../../utils/mediaDuration'
import { generateAudioWaveform, normalizeWaveform } from '../../utils/audioWaveform'
import { useMediaCleanup } from '../../hooks/useMediaCleanup'
import UploadArea from '../Shared/UploadArea'
import MediaItem from '../Shared/MediaItem'
import { SUPPORTED_AUDIO_TYPES } from '../../types/media'

export default function AudioPanel() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

  useMediaCleanup(mediaFiles)

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newMediaFiles = await Promise.all(
      files.map(async (file) => {
        const mediaType = getMediaType(file)
        if (mediaType !== 'audio') return null

        const url = URL.createObjectURL(file)
        const duration = await getMediaDuration(file, 'audio')
        
        let waveform: number[] | undefined
        try {
          const waveformData = await generateAudioWaveform(file, 200)
          waveform = normalizeWaveform(waveformData.peaks)
        } catch (error) {
          console.warn('Failed to generate waveform for', file.name, error)
        }
        
        const mediaFile: MediaFile = {
          id: generateMediaId(),
          name: file.name,
          type: 'audio',
          file,
          url,
          size: file.size,
          duration,
          waveform,
        }

        return mediaFile
      })
    )

    const validFiles = newMediaFiles.filter((media): media is MediaFile => media !== null)
    setMediaFiles((prev) => [...prev, ...validFiles])
  }, [])

  const handleMediaSelect = (media: MediaFile) => {
    console.log('Selected audio:', media)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <UploadArea 
          onFilesSelected={handleFilesSelected}
          accept={SUPPORTED_AUDIO_TYPES.join(',')}
          supportedFormats="MP3, WAV, M4A"
          validateFile={isValidAudioFile}
        />

        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Audio
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

