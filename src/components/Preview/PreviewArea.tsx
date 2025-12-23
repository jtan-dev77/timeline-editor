import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { useTimeline } from '../../contexts/TimelineContext'
import type { TimelineClip } from '../../types/timeline'

function DraggableText({ 
  textClip, 
  onDragEnd 
}: { 
  textClip: TimelineClip
  onDragEnd: (clipId: string, x: number, y: number) => void 
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<{ deltaX: number; deltaY: number } | null>(null)
  const dragStartRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const baseX = textClip.textStyle?.x ?? 50
  const baseY = textClip.textStyle?.y ?? 50
  const displayX = isDragging && dragOffset ? baseX + dragOffset.deltaX : baseX
  const displayY = isDragging && dragOffset ? baseY + dragOffset.deltaY : baseY

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragOffset({ deltaX: 0, deltaY: 0 })
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: baseX,
      startPosY: baseY,
    }
  }, [baseX, baseY])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const parent = containerRef.current?.parentElement
      const dragStart = dragStartRef.current
      if (!parent || !dragStart) return

      const rect = parent.getBoundingClientRect()
      const deltaX = ((e.clientX - dragStart.startX) / rect.width) * 100
      const deltaY = ((e.clientY - dragStart.startY) / rect.height) * 100

      const clampedDeltaX = Math.max(-dragStart.startPosX, Math.min(100 - dragStart.startPosX, deltaX))
      const clampedDeltaY = Math.max(-dragStart.startPosY, Math.min(100 - dragStart.startPosY, deltaY))

      setDragOffset({ deltaX: clampedDeltaX, deltaY: clampedDeltaY })
    }

    const handleMouseUp = () => {
      const dragStart = dragStartRef.current
      if (dragStart && dragOffset) {
        const finalX = Math.max(0, Math.min(100, dragStart.startPosX + dragOffset.deltaX))
        const finalY = Math.max(0, Math.min(100, dragStart.startPosY + dragOffset.deltaY))
        onDragEnd(textClip.id, finalX, finalY)
      }
      setIsDragging(false)
      setDragOffset(null)
      dragStartRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, textClip.id, onDragEnd])

  const style = textClip.textStyle || {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Arial',
    x: 50,
    y: 50,
    bold: false,
    italic: false,
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${displayX}%`,
        top: `${displayY}%`,
        transform: 'translate(-50%, -50%)',
        fontSize: `${style.fontSize || 24}px`,
        color: style.color || '#FFFFFF',
        fontFamily: style.fontFamily || 'Arial',
        fontWeight: style.bold ? 'bold' : 'normal',
        fontStyle: style.italic ? 'italic' : 'normal',
        opacity: (textClip.opacity ?? 100) / 100,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        padding: '8px',
        borderRadius: '4px',
        border: isDragging ? '2px dashed rgba(59, 130, 246, 0.8)' : '2px dashed transparent',
        backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      }}
    >
      {textClip.media.content || 'Enter your text here'}
    </div>
  )
}

export default function PreviewArea() {
  const { tracks, currentTime, isPlaying, updateClip } = useTimeline()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const prevAudioClipIdRef = useRef<string | null>(null)
  const prevVideoClipIdRef = useRef<string | null>(null)
  const prevIsPlayingRef = useRef(false)

  const activeClips = useMemo(() => {
    const videoTrack = tracks[0] || []
    const audioTrack = tracks[1] || []
    const textTrack = tracks[2] || []

    const videoClip = videoTrack.find(
      (clip) => {
        const clipStart = clip.startTime
        const clipEnd = clip.endTime
        return currentTime >= clipStart && currentTime < clipEnd
      }
    )
    const audioClip = audioTrack.find(
      (clip) => {
        const clipStart = clip.startTime
        const clipEnd = clip.endTime
        return currentTime >= clipStart && currentTime < clipEnd
      }
    )
    const textClips = textTrack.filter(
      (clip) => currentTime >= clip.startTime && currentTime < clip.endTime
    )

    return {
      video: videoClip ? { 
        clip: videoClip, 
        offset: (videoClip.mediaStartOffset ?? 0) + (currentTime - videoClip.startTime) 
      } : null,
      audio: audioClip ? { 
        clip: audioClip, 
        offset: (audioClip.mediaStartOffset ?? 0) + (currentTime - audioClip.startTime) 
      } : null,
      text: textClips,
    }
  }, [tracks, currentTime])

  const activeVideoClip = activeClips.video
  const activeAudioClip = activeClips.audio
  const activeTextClips = activeClips.text

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const currentClipId = activeVideoClip?.clip.id ?? null
    const clipChanged = prevVideoClipIdRef.current !== currentClipId
    const playbackJustStarted = isPlaying && !prevIsPlayingRef.current
    prevVideoClipIdRef.current = currentClipId

    if (activeVideoClip) {
      const targetTime = activeVideoClip.offset
      const speed = activeVideoClip.clip.speed ?? 1
      const isMuted = activeVideoClip.clip.muted ?? false

      const needsSync = clipChanged || playbackJustStarted || (!isPlaying && Math.abs(video.currentTime - targetTime) > 0.1)
      if (needsSync) {
        video.currentTime = targetTime
      }

      video.playbackRate = speed
      video.muted = isMuted

      if (isPlaying) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } else {
        video.pause()
      }
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [activeVideoClip, isPlaying, activeVideoClip?.clip.speed, activeVideoClip?.clip.muted, activeVideoClip?.clip.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const currentClipId = activeAudioClip?.clip.id ?? null
    const clipChanged = prevAudioClipIdRef.current !== currentClipId
    const playbackJustStarted = isPlaying && !prevIsPlayingRef.current
    prevAudioClipIdRef.current = currentClipId

    if (activeAudioClip) {
      const targetTime = activeAudioClip.offset
      const speed = activeAudioClip.clip.speed ?? 1
      const isMuted = activeAudioClip.clip.muted ?? false

      const needsSync = clipChanged || playbackJustStarted || (!isPlaying && Math.abs(audio.currentTime - targetTime) > 0.1)
      if (needsSync) {
        audio.currentTime = targetTime
      }

      audio.playbackRate = speed
      audio.muted = isMuted

      if (isPlaying) {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } else {
        audio.pause()
      }
    } else {
      audio.pause()
      audio.currentTime = 0
      if (clipChanged) {
        audio.src = ''
      }
    }
  }, [activeAudioClip, isPlaying, activeAudioClip?.clip.speed, activeAudioClip?.clip.muted, activeAudioClip?.clip.id])

  useEffect(() => {
    prevIsPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current && activeAudioClip) {
      const audioLevel = activeAudioClip.clip.audioLevel ?? 100
      audioRef.current.volume = audioLevel / 100
    }
  }, [activeAudioClip])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!activeAudioClip && !audio.paused) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [currentTime, activeAudioClip])

  useEffect(() => {
    if (audioRef.current && activeAudioClip) {
      const audio = audioRef.current
      const newSrc = activeAudioClip.clip.media.url
      
      const currentSrc = audio.getAttribute('src') || audio.src
      if (currentSrc !== newSrc && newSrc) {
        audio.src = newSrc
        audio.load()
      }
    } else if (audioRef.current && !activeAudioClip) {
      audioRef.current.src = ''
      audioRef.current.load()
    }
  }, [activeAudioClip?.clip.media.url, activeAudioClip])

  useEffect(() => {
    if (videoRef.current && activeVideoClip) {
      const speed = activeVideoClip.clip.speed ?? 1
      videoRef.current.playbackRate = speed
    }
  }, [activeVideoClip?.clip.speed, activeVideoClip])

  useEffect(() => {
    if (audioRef.current && activeAudioClip) {
      const speed = activeAudioClip.clip.speed ?? 1
      audioRef.current.playbackRate = speed
    }
  }, [activeAudioClip?.clip.speed, activeAudioClip])

  const hasMedia = activeVideoClip || activeAudioClip || activeTextClips.length > 0

  return (
    <div className="flex-1 bg-gray-900 dark:bg-black relative flex items-center justify-center overflow-hidden">
      {hasMedia ? (
        <>
          {activeVideoClip && (
            <video
              ref={videoRef}
              src={activeVideoClip.clip.media.url}
              className="max-w-full max-h-full"
              style={{
                opacity: (activeVideoClip.clip.opacity ?? 100) / 100,
              }}
              preload="auto"
              playsInline
              crossOrigin="anonymous"
            />
          )}
          {activeAudioClip && !activeVideoClip && (
            <div className="flex flex-col items-center justify-center text-white">
              <svg className="w-24 h-24 mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.618 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.618l3.765-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-gray-400">{activeAudioClip.clip.media.name}</p>
            </div>
          )}
          <audio 
            ref={audioRef}
            src={activeAudioClip?.clip.media.url}
            preload="auto"
            onEnded={() => {
              if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
              }
            }}
          />
          {activeTextClips.map((textClip) => (
            <DraggableText
              key={textClip.id}
              textClip={textClip}
              onDragEnd={(clipId, x, y) => {
                updateClip(clipId, {
                  textStyle: {
                    ...textClip.textStyle,
                    x,
                    y,
                  },
                })
              }}
            />
          ))}
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="mb-4">Add media to timeline to start editing</p>
        </div>
      )}
    </div>
  )
}

