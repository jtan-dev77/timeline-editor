import { useRef, useState } from 'react'
import type { MediaFile } from '../../types/media'
import type { TrackType, TimelineClip as TimelineClipType } from '../../types/timeline'
import { useTimeline } from '../../contexts/TimelineContext'
import TimelineClip from './TimelineClip'

interface TimelineTrackProps {
  type: TrackType
  clips: TimelineClipType[]
  pixelsPerSecond: number
}

export default function TimelineTrack({ type, clips, pixelsPerSecond }: TimelineTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const { addClipToTrack, selectClip } = useTimeline()

  const getTrackLabel = () => {
    switch (type) {
      case 'video':
        return 'Video'
      case 'audio':
        return 'Audio'
      case 'text':
        return 'Text'
    }
  }

  const getTrackColor = () => {
    switch (type) {
      case 'video':
        return 'bg-blue-50 dark:bg-blue-900/20'
      case 'audio':
        return 'bg-green-50 dark:bg-green-900/20'
      case 'text':
        return 'bg-purple-50 dark:bg-purple-900/20'
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)

    try {
      const mediaData = e.dataTransfer.getData('application/json')
      if (!mediaData) return

      const mediaDataParsed = JSON.parse(mediaData)
      
      if (
        (type === 'video' && mediaDataParsed.type !== 'video') ||
        (type === 'audio' && mediaDataParsed.type !== 'audio') ||
        (type === 'text' && mediaDataParsed.type !== 'text')
      ) {
        return
      }

      const media: MediaFile = {
        ...mediaDataParsed,
        file: new File([], mediaDataParsed.name),
      }

      if (contentRef.current) {
        addClipToTrack(media, type, 0)
      }
    } catch (error) {
      console.error('Error handling drop:', error)
    }
  }

  return (
    <div
      ref={trackRef}
      className={`h-16 border-b border-gray-200 dark:border-gray-700 relative ${getTrackColor()} ${
        isDraggingOver ? 'ring-2 ring-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 z-10">
        {getTrackLabel()}
      </div>
      <div 
        ref={contentRef} 
        className="ml-24 h-full relative"
        onClick={() => selectClip(null)}
      >
        {clips.map((clip) => (
          <TimelineClip
            key={clip.id}
            clip={clip}
            pixelsPerSecond={pixelsPerSecond}
          />
        ))}
      </div>
    </div>
  )
}

