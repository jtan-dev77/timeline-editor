export const getMediaDuration = (file: File, type: 'video' | 'audio'): Promise<number> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const mediaElement = type === 'video' 
      ? document.createElement('video')
      : document.createElement('audio')

    mediaElement.preload = 'metadata'
    mediaElement.src = url

    const cleanup = () => {
      URL.revokeObjectURL(url)
    }

    mediaElement.onloadedmetadata = () => {
      const duration = mediaElement.duration
      cleanup()
      if (duration && isFinite(duration) && duration > 0) {
        resolve(duration)
      } else {
        resolve(0)
      }
    }

    mediaElement.onerror = () => {
      cleanup()
      resolve(0)
    }

    mediaElement.load()
  })
}

