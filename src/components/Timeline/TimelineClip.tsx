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
  const [isDragging, setIsDragging] = useState(false)

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
    if (!isDragging) {
      selectClip(clip)
    }
  }

  const handleClipMouseDown = (e: React.MouseEvent) => {
    if (e.target === leftHandleRef.current || e.target === rightHandleRef.current) {
      return
    }
    
    e.stopPropagation()
    setIsDragging(true)
    selectClip(clip)

    const startX = e.clientX
    const startTime = clip.startTime
    const clipDuration = clip.endTime - clip.startTime

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaTime = deltaX / pixelsPerSecond
      const newStartTime = Math.max(0, startTime + deltaTime)
      const newEndTime = newStartTime + clipDuration

      updateClip(clip.id, {
        startTime: newStartTime,
        endTime: newEndTime,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResizeStart = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.stopPropagation()
    setIsResizing(side)
    selectClip(clip)

    const startX = e.clientX
    const startTime = side === 'left' ? clip.startTime : clip.endTime
    const startPixels = startTime * pixelsPerSecond

    const originalDuration = clip.originalDuration ?? (clip.media.duration ?? (clip.endTime - clip.startTime))
    const isVideoOrAudio = clip.media.type === 'video' || clip.media.type === 'audio'

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaTime = deltaX / pixelsPerSecond
      const newTime = Math.max(0, startPixels / pixelsPerSecond + deltaTime)

      if (side === 'left') {
        const minTime = 0
        const maxTime = clip.endTime - 0.1
        let clampedTime = Math.max(minTime, Math.min(newTime, maxTime))
        
        if (isVideoOrAudio) {
          const maxStartTime = clip.endTime - originalDuration
          clampedTime = Math.max(0, Math.min(clampedTime, maxStartTime))
        }
        
        updateClip(clip.id, { startTime: clampedTime })
      } else {
        const minTime = clip.startTime + 0.1
        let clampedTime = Math.max(minTime, newTime)
        
        if (isVideoOrAudio) {
          const maxEndTime = clip.startTime + originalDuration
          clampedTime = Math.min(clampedTime, maxEndTime)
        }
        
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
      className={`absolute h-full ${getClipColor()} rounded cursor-move transition-colors flex items-center px-2 text-white text-xs font-medium shadow-md border-2 ${
        isSelected ? 'border-yellow-400' : 'border-white/20'
      }`}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 60)}px`,
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={handleClipClick}
      onMouseDown={handleClipMouseDown}
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
