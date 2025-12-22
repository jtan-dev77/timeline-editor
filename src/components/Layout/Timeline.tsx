import { useRef, useState, useEffect } from 'react'
import { useTimeline } from '../../contexts/TimelineContext'
import TimelineTrack from '../Timeline/TimelineTrack'
import TimelineControls from '../Timeline/TimelineControls'

const BASE_PIXELS_PER_SECOND = 50

export default function Timeline() {
  const { tracks, zoom, currentTime, duration, setCurrentTime } = useTimeline()
  const pixelsPerSecond = BASE_PIXELS_PER_SECOND * zoom
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false)
  const playheadPosition = currentTime * pixelsPerSecond + 96

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingPlayhead(true)
  }

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current && !isDraggingPlayhead) {
      const rect = timelineRef.current.getBoundingClientRect()
      const scrollContainer = timelineRef.current.closest('.overflow-x-auto')
      const scrollLeft = scrollContainer ? (scrollContainer as HTMLElement).scrollLeft : 0
      const x = e.clientX - rect.left + scrollLeft - 96
      const newTime = Math.max(0, Math.min(x / pixelsPerSecond, duration))
      setCurrentTime(newTime)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPlayhead && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect()
        const scrollContainer = timelineRef.current.closest('.overflow-x-auto')
        const scrollLeft = scrollContainer ? (scrollContainer as HTMLElement).scrollLeft : 0
        const x = e.clientX - rect.left + scrollLeft - 96
        const newTime = Math.max(0, Math.min(x / pixelsPerSecond, duration))
        setCurrentTime(newTime)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false)
    }

    if (isDraggingPlayhead) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingPlayhead, pixelsPerSecond, duration])

  const getMarkerInterval = () => {
    if (zoom < 0.5) return 10
    if (zoom < 1) return 5
    if (zoom < 2) return 3
    if (zoom < 3) return 1
    return 0.5
  }

  const timeMarkers: number[] = []
  const maxTime = Math.max(duration, 60)
  const interval = getMarkerInterval()
  for (let i = 0; i <= maxTime; i += interval) {
    timeMarkers.push(i)
  }

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="h-48 overflow-x-auto overflow-y-hidden">
        <div className="relative h-full min-h-[192px]">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 ml-24" style={{ minWidth: `${maxTime * pixelsPerSecond}px` }}>
            {timeMarkers.map((time, index) => {
              const position = time * pixelsPerSecond
              const nextMarker = timeMarkers[index + 1]
              const spacing = nextMarker ? (nextMarker - time) * pixelsPerSecond : 50
              const minSpacing = 50
              
              if (spacing < minSpacing && index > 0) {
                return null
              }
              
              return (
                <div
                  key={time}
                  className="absolute top-0 bottom-0 flex flex-col items-start pointer-events-none"
                  style={{ left: `${position}px` }}
                >
                  <div className="h-2 w-px bg-gray-400 dark:bg-gray-600"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 whitespace-nowrap">
                    {formatTime(time)}
                  </span>
                </div>
              )
            })}
          </div>

          <div
            ref={timelineRef}
            className="absolute top-8 bottom-0 left-0 right-0"
            onClick={handleTimelineClick}
          >
            <div
              className={`absolute top-0 bottom-0 w-0.5 bg-orange-500 z-30 cursor-ew-resize ${isDraggingPlayhead ? 'opacity-80' : ''}`}
              style={{ left: `${playheadPosition}px` }}
              onMouseDown={handlePlayheadMouseDown}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-orange-500"></div>
            </div>
            
            <TimelineTrack type="video" clips={tracks[0]} pixelsPerSecond={pixelsPerSecond} />
            <TimelineTrack type="audio" clips={tracks[1]} pixelsPerSecond={pixelsPerSecond} />
            <TimelineTrack type="text" clips={tracks[2]} pixelsPerSecond={pixelsPerSecond} />
          </div>
        </div>
      </div>
      <TimelineControls />
    </div>
  )
}
