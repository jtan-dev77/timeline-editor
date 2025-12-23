import { useEffect } from 'react'
import type { MediaFile } from '../types/media'

export function useMediaCleanup(mediaFiles: MediaFile[]) {
  useEffect(() => {
    return () => {
      mediaFiles.forEach((media) => {
        if (media.url) {
          URL.revokeObjectURL(media.url)
        }
        if (media.thumbnail && media.thumbnail !== media.url) {
          URL.revokeObjectURL(media.thumbnail)
        }
      })
    }
  }, [mediaFiles])
}

