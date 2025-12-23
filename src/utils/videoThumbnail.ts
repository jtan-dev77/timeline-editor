export async function generateVideoThumbnail(
  videoFile: File,
  timeOffset: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(timeOffset, video.duration * 0.1)
    }

    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnailUrl = URL.createObjectURL(blob)
            resolve(thumbnailUrl)
          } else {
            reject(new Error('Failed to create thumbnail blob'))
          }
        },
        'image/jpeg',
        0.8
      )
    }

    video.onerror = () => {
      reject(new Error('Failed to load video for thumbnail generation'))
    }

    video.src = URL.createObjectURL(videoFile)
  })
}

export async function generateVideoThumbnails(
  videoFile: File,
  count: number = 4
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const thumbnails: string[] = []
    let currentIndex = 0

    video.onloadedmetadata = () => {
      const duration = video.duration
      const interval = duration / (count + 1)
      
      const captureFrame = (index: number) => {
        if (index >= count) {
          resolve(thumbnails)
          return
        }

        video.currentTime = interval * (index + 1)
      }

      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnailUrl = URL.createObjectURL(blob)
              thumbnails.push(thumbnailUrl)
              currentIndex++
              captureFrame(currentIndex)
            } else {
              reject(new Error('Failed to create thumbnail blob'))
            }
          },
          'image/jpeg',
          0.8
        )
      }

      video.onerror = () => {
        reject(new Error('Failed to load video for thumbnail generation'))
      }

      captureFrame(0)
    }

    video.src = URL.createObjectURL(videoFile)
  })
}

