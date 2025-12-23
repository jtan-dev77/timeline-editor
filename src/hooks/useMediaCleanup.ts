import { useEffect, useRef } from 'react'
import type { MediaFile } from '../types/media'

export function useMediaCleanup(mediaFiles: MediaFile[]) {
  const prevMediaFilesRef = useRef<MediaFile[]>([])

  useEffect(() => {
    const prevFiles = prevMediaFilesRef.current
    const currentIds = new Set(mediaFiles.map(m => m.id))

    prevFiles.forEach((media) => {
      if (!currentIds.has(media.id)) {
        if (media.url && media.url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(media.url)
          } catch (e) {
            console.warn('Failed to revoke URL:', e)
          }
        }
        if (media.thumbnail && media.thumbnail !== media.url && media.thumbnail.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(media.thumbnail)
          } catch (e) {
            console.warn('Failed to revoke thumbnail URL:', e)
          }
        }
      }
    })

    prevMediaFilesRef.current = mediaFiles
  }, [mediaFiles])

  useEffect(() => {
    return () => {
      prevMediaFilesRef.current.forEach((media) => {
        if (media.url && media.url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(media.url)
          } catch (e) {
            console.warn('Failed to revoke URL on unmount:', e)
          }
        }
        if (media.thumbnail && media.thumbnail !== media.url && media.thumbnail.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(media.thumbnail)
          } catch (e) {
            console.warn('Failed to revoke thumbnail URL on unmount:', e)
          }
        }
      })
    }
  }, [])
}

