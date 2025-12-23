import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { MediaFile } from '../types/media'
import type { TimelineClip, TrackType } from '../types/timeline'
import { generateMediaId } from '../utils/fileUtils'

interface TimelineContextType {
  tracks: TimelineClip[][]
  selectedClip: TimelineClip | null
  addClipToTrack: (media: MediaFile, trackType: TrackType, startTime: number) => void
  removeClip: (clipId: string) => void
  updateClip: (clipId: string, updates: Partial<TimelineClip>) => void
  selectClip: (clip: TimelineClip | null) => void
  splitClip: (clipId: string, splitTime: number) => void
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
  const [selectedClip, setSelectedClip] = useState<TimelineClip | null>(null)
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
      originalDuration: duration,
      opacity: 100,
      audioLevel: 100,
      speed: 1,
      blendMode: 'normal',
      textStyle: media.type === 'text' ? {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Arial',
        alignment: 'center',
        bold: false,
        italic: false,
      } : undefined,
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
        track.map((clip) => {
          if (clip.id === clipId) {
            const updated = { ...clip, ...updates }
            
            if ('speed' in updates && updates.speed !== undefined) {
              const newSpeed = updates.speed
              let originalDuration = updated.originalDuration
              
              if (originalDuration === undefined) {
                originalDuration = updated.endTime - updated.startTime
                updated.originalDuration = originalDuration
              }
              
              const newDuration = originalDuration / newSpeed
              updated.endTime = updated.startTime + newDuration
            }
            
            if (selectedClip?.id === clipId) {
              setSelectedClip(updated)
            }
            return updated
          }
          return clip
        })
      )
    )
  }, [selectedClip])

  const selectClip = useCallback((clip: TimelineClip | null) => {
    setSelectedClip(clip)
  }, [])

  const splitClip = useCallback((clipId: string, splitTime: number) => {
    setTracks((prev) =>
      prev.map((track) => {
        const clipIndex = track.findIndex((clip) => clip.id === clipId)
        if (clipIndex === -1) return track

        const clip = track[clipIndex]
        if (splitTime <= clip.startTime || splitTime >= clip.endTime) {
          return track
        }

        const firstPart: TimelineClip = {
          ...clip,
          endTime: splitTime,
          originalDuration: clip.originalDuration || (clip.endTime - clip.startTime),
        }

        const secondPart: TimelineClip = {
          ...clip,
          id: generateMediaId(),
          startTime: splitTime,
          originalDuration: clip.originalDuration || (clip.endTime - clip.startTime),
        }

        const newTrack = [...track]
        newTrack[clipIndex] = firstPart
        newTrack.splice(clipIndex + 1, 0, secondPart)

        return newTrack
      })
    )
  }, [])

  return (
    <TimelineContext.Provider
      value={{
        tracks,
        selectedClip,
        addClipToTrack,
        removeClip,
        updateClip,
        selectClip,
        splitClip,
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

