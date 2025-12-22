import { useEffect, useRef, useMemo } from 'react'
import { useTimeline } from '../../contexts/TimelineContext'

export default function PreviewArea() {
  const { tracks, currentTime, isPlaying } = useTimeline()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const activeClips = useMemo(() => {
    const videoTrack = tracks[0] || []
    const audioTrack = tracks[1] || []
    const textTrack = tracks[2] || []

    const videoClip = videoTrack.find(
      (clip) => currentTime >= clip.startTime && currentTime < clip.endTime
    )
    const audioClip = audioTrack.find(
      (clip) => currentTime >= clip.startTime && currentTime < clip.endTime
    )
    const textClips = textTrack.filter(
      (clip) => currentTime >= clip.startTime && currentTime < clip.endTime
    )

    return {
      video: videoClip ? { clip: videoClip, offset: currentTime - videoClip.startTime } : null,
      audio: audioClip ? { clip: audioClip, offset: currentTime - audioClip.startTime } : null,
      text: textClips,
    }
  }, [tracks, currentTime])

  const activeVideoClip = activeClips.video
  const activeAudioClip = activeClips.audio
  const activeTextClips = activeClips.text

  useEffect(() => {
    if (videoRef.current && activeVideoClip) {
      const video = videoRef.current
      const targetTime = activeVideoClip.offset

      if (Math.abs(video.currentTime - targetTime) > 0.05) {
        video.currentTime = targetTime
      }

      if (isPlaying) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } else {
        video.pause()
      }
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [activeVideoClip, isPlaying])

  useEffect(() => {
    if (audioRef.current && activeAudioClip) {
      const audio = audioRef.current
      const targetTime = activeAudioClip.offset

      if (Math.abs(audio.currentTime - targetTime) > 0.05) {
        audio.currentTime = targetTime
      }

      if (isPlaying) {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } else {
        audio.pause()
      }
    } else if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [activeAudioClip, isPlaying])

  useEffect(() => {
    if (audioRef.current && activeAudioClip) {
      const audioLevel = activeAudioClip.clip.audioLevel ?? 100
      audioRef.current.volume = audioLevel / 100
    }
  }, [activeAudioClip])

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
              muted={false}
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
          <audio ref={audioRef} src={activeAudioClip?.clip.media.url} />
          {activeTextClips.map((textClip) => {
            const style = textClip.textStyle || {
              fontSize: 24,
              color: '#FFFFFF',
              fontFamily: 'Arial',
              alignment: 'center',
              bold: false,
              italic: false,
            }
            return (
              <div
                key={textClip.id}
                className="absolute"
                style={{
                  fontSize: `${style.fontSize}px`,
                  color: style.color,
                  fontFamily: style.fontFamily,
                  textAlign: style.alignment,
                  fontWeight: style.bold ? 'bold' : 'normal',
                  fontStyle: style.italic ? 'italic' : 'normal',
                  opacity: (textClip.opacity ?? 100) / 100,
                  width: '100%',
                  padding: '20px',
                  pointerEvents: 'none',
                }}
              >
                {textClip.media.content || 'Enter your text here'}
              </div>
            )
          })}
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="mb-4">Add media to timeline to start editing</p>
        </div>
      )}
    </div>
  )
}

