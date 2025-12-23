import { useRef, useState } from 'react'
import type { MediaFile } from '../../types/media'
import { formatFileSize } from '../../utils/fileUtils'
import VideoIcon from '../../assets/video-icon'
import AudioIcon from '../../assets/audio-icon'
import ImageIcon from '../../assets/image-icon'
import TextIcon from '../../assets/text-icon'

interface MediaItemProps {
  media: MediaFile
  onSelect?: (media: MediaFile) => void
}

export default function MediaItem({ media, onSelect }: MediaItemProps) {
  const dragRef = useRef<HTMLDivElement>(null)
  const [thumbnailError, setThumbnailError] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    const serializableMedia = {
      id: media.id,
      name: media.name,
      type: media.type,
      url: media.url,
      thumbnail: media.thumbnail,
      duration: media.duration,
      size: media.size,
      content: media.content,
      waveform: media.waveform,
    }
    e.dataTransfer.setData('application/json', JSON.stringify(serializableMedia))
    if (dragRef.current) {
      dragRef.current.style.opacity = '0.5'
    }
  }

  const handleDragEnd = () => {
    if (dragRef.current) {
      dragRef.current.style.opacity = '1'
    }
  }
  
  const getIcon = () => {
    const iconProps = { className: 'w-6 h-6' }
    switch (media.type) {
      case 'video':
        return <VideoIcon {...iconProps} />
      case 'audio':
        return <AudioIcon {...iconProps} />
      case 'image':
        return <ImageIcon {...iconProps} />
      case 'text':
        return <TextIcon {...iconProps} />
    }
  }

  const hasThumbnail = (media.type === 'video' || media.type === 'image') && media.thumbnail && !thumbnailError

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-move transition-colors"
      onClick={() => onSelect?.(media)}
    >
      <div className="flex-shrink-0 text-gray-600 dark:text-gray-400">
        {hasThumbnail ? (
          <div className="w-12 h-12 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <img
              src={media.thumbnail}
              alt={media.name}
              className="w-full h-full object-cover"
              onError={() => setThumbnailError(true)}
            />
          </div>
        ) : (
          getIcon()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {media.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(media.size)}
        </p>
      </div>
    </div>
  )
}
