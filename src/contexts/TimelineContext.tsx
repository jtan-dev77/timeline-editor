import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { MediaFile } from '../types/media'
import type { TimelineClip, TrackType } from '../types/timeline'
import { generateMediaId } from '../utils/fileUtils'

interface TimelineContextType {
  tracks: TimelineClip[][]
  addClipToTrack: (media: MediaFile, trackType: TrackType, startTime: number) => void
  removeClip: (clipId: string) => void
  updateClip: (clipId: string, updates: Partial<TimelineClip>) => void
  isPlaying: boolean
  currentTime: number
  duration: number
  zoom: number
  setCurrentTime: (time: number) => void
  togglePlay: () => void
  setZoom: (zoom: number) => void
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined)

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<TimelineClip[][]>([[], [], []])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [zoom, setZoom] = useState(1)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const currentTimeRef = useRef(0)

  const allClips = tracks.flat()
  const duration = allClips.length === 0 
    ? 10 
    : Math.max(...allClips.map((clip) => clip.endTime), 10)

  useEffect(() => {
    currentTimeRef.current = currentTime
  }, [currentTime])

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - currentTimeRef.current * 1000
      const updateTime = () => {
        const elapsed = (Date.now() - startTime) / 1000
        if (elapsed >= duration) {
          setCurrentTime(duration)
          setIsPlaying(false)
        } else {
          setCurrentTime(elapsed)
          animationFrameRef.current = requestAnimationFrame(updateTime)
        }
      }
      animationFrameRef.current = requestAnimationFrame(updateTime)
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, duration])

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev && currentTime >= duration) {
        setCurrentTime(0)
      }
      return !prev
    })
  }, [currentTime, duration])

  const addClipToTrack = useCallback((media: MediaFile, trackType: TrackType, startTime: number) => {
    const trackIndex = trackType === 'video' ? 0 : trackType === 'audio' ? 1 : 2
    
    const duration = media.duration && media.duration > 0 ? media.duration : 10
    
    const newClip: TimelineClip = {
      id: generateMediaId(),
      mediaId: media.id,
      media,
      startTime,
      endTime: startTime + duration,
      trackIndex,
    }

    setTracks((prev) => {
      const newTracks = [...prev]
      newTracks[trackIndex] = [...newTracks[trackIndex], newClip]
      return newTracks
    })
  }, [])

  const removeClip = useCallback((clipId: string) => {
    setTracks((prev) =>
      prev.map((track) => track.filter((clip) => clip.id !== clipId))
    )
  }, [])

  const updateClip = useCallback((clipId: string, updates: Partial<TimelineClip>) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.map((clip) =>
          clip.id === clipId ? { ...clip, ...updates } : clip
        )
      )
    )
  }, [])

  return (
    <TimelineContext.Provider
      value={{
        tracks,
        addClipToTrack,
        removeClip,
        updateClip,
        isPlaying,
        currentTime,
        duration,
        zoom,
        setCurrentTime,
        togglePlay,
        setZoom,
      }}
    >
      {children}
    </TimelineContext.Provider>
  )
}

export function useTimeline() {
  const context = useContext(TimelineContext)
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider')
  }
  return context
}

