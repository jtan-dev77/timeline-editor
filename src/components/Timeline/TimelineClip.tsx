import { useRef, useState } from 'react'
import type { TimelineClip as TimelineClipType } from '../../types/timeline'
import { useTimeline } from '../../contexts/TimelineContext'

interface TimelineClipProps {
  clip: TimelineClipType
  pixelsPerSecond: number
}

export default function TimelineClip({ clip, pixelsPerSecond }: TimelineClipProps) {
  const { selectedClip, selectClip, updateClip } = useTimeline()
  const clipRef = useRef<HTMLDivElement>(null)
  const leftHandleRef = useRef<HTMLDivElement>(null)
  const rightHandleRef = useRef<HTMLDivElement>(null)
  const [, setIsResizing] = useState<'left' | 'right' | null>(null)

  const width = (clip.endTime - clip.startTime) * pixelsPerSecond
  const left = clip.startTime * pixelsPerSecond
  const isSelected = selectedClip?.id === clip.id

  const getClipColor = () => {
    switch (clip.media.type) {
      case 'video':
        return isSelected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
      case 'audio':
        return isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
      case 'text':
        return isSelected ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
      default:
        return isSelected ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const handleClipClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectClip(clip)
  }

  const handleResizeStart = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.stopPropagation()
    setIsResizing(side)
    selectClip(clip)

    const startX = e.clientX
    const startTime = side === 'left' ? clip.startTime : clip.endTime
    const startPixels = startTime * pixelsPerSecond

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaTime = deltaX / pixelsPerSecond
      const newTime = Math.max(0, startPixels / pixelsPerSecond + deltaTime)

      if (side === 'left') {
        const minTime = 0
        const maxTime = clip.endTime - 0.1
        const clampedTime = Math.max(minTime, Math.min(newTime, maxTime))
        updateClip(clip.id, { startTime: clampedTime })
      } else {
        const minTime = clip.startTime + 0.1
        const clampedTime = Math.max(minTime, newTime)
        updateClip(clip.id, { endTime: clampedTime })
      }
    }

    const handleMouseUp = () => {
      setIsResizing(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={clipRef}
      className={`absolute h-full ${getClipColor()} rounded cursor-pointer transition-colors flex items-center px-2 text-white text-xs font-medium shadow-md border-2 ${
        isSelected ? 'border-yellow-400' : 'border-white/20'
      }`}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 60)}px`,
        zIndex: isSelected ? 10 : 1,
        opacity: (clip.opacity ?? 100) / 100,
      }}
      onClick={handleClipClick}
      title={clip.media.name}
    >
      {isSelected && (
        <>
          <div
            ref={leftHandleRef}
            className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-400 hover:bg-yellow-500 cursor-ew-resize rounded-l"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
          <div
            ref={rightHandleRef}
            className="absolute right-0 top-0 bottom-0 w-2 bg-yellow-400 hover:bg-yellow-500 cursor-ew-resize rounded-r"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
        </>
      )}
      <span className="truncate z-10">{clip.media.name}</span>
    </div>
  )
}
