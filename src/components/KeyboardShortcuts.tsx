import { useTimeline } from '../contexts/TimelineContext'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

export default function KeyboardShortcuts() {
  const { isPlaying, currentTime, duration, setCurrentTime, togglePlay } = useTimeline()

  const handlePlayPause = () => {
    if (!isPlaying && currentTime >= duration) {
      setCurrentTime(0)
    }
    togglePlay()
  }

  const handleMoveBackward = () => {
    if (isPlaying) {
      togglePlay()
    }
    const newTime = Math.max(0, currentTime - 5)
    setCurrentTime(newTime)
  }

  const handleMoveForward = () => {
    if (isPlaying) {
      togglePlay()
    }
    const newTime = Math.min(duration, currentTime + 5)
    setCurrentTime(newTime)
  }

  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onMoveBackward: handleMoveBackward,
    onMoveForward: handleMoveForward,
  })

  return null
}

