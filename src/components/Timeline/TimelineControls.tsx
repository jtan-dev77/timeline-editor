import { useTimeline } from '../../contexts/TimelineContext'

export default function TimelineControls() {
  const { isPlaying, currentTime, duration, setCurrentTime, togglePlay, zoom, setZoom, selectedClip, splitClip } = useTimeline()

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(Math.max(0, Math.min(newTime, duration)))
  }

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value)
    setZoom(newZoom)
  }

  const handlePlayClick = () => {
    if (!isPlaying && currentTime >= duration) {
      setCurrentTime(0)
    }
    togglePlay()
  }

  const handleSplit = () => {
    if (selectedClip && currentTime > selectedClip.startTime && currentTime < selectedClip.endTime) {
      splitClip(selectedClip.id, currentTime)
    }
  }

  return (
    <div className="h-16 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex items-center gap-4 px-4">
      <button
        onClick={handlePlayClick}
        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <button
        onClick={handleSplit}
        disabled={!selectedClip || currentTime <= selectedClip.startTime || currentTime >= selectedClip.endTime}
        className="p-2 rounded-lg bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors"
        aria-label="Split clip"
        title="Split clip at playhead"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-400 font-mono min-w-[3rem]">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-xs text-gray-600 dark:text-gray-400 font-mono min-w-[3rem]">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center gap-2 min-w-[200px]">
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-6v6" />
        </svg>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={zoom}
          onChange={handleZoomChange}
          className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10V7m0 0V4m0 3h3m-3 0h-3" />
        </svg>
      </div>
    </div>
  )
}

