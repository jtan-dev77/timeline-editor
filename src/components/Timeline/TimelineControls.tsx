import { useTimeline } from '../../contexts/TimelineContext'

export default function TimelineControls() {
  const { isPlaying, currentTime, duration, setCurrentTime, togglePlay, zoom, setZoom, selectedClip, splitClip, removeClip, updateClip } = useTimeline()

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const handlePreviousFrame = () => {
    if (isPlaying) {
      togglePlay()
    }
    const newTime = Math.max(0, currentTime - 5)
    setCurrentTime(newTime)
  }

  const handleNextFrame = () => {
    if (isPlaying) {
      togglePlay()
    }
    const newTime = Math.min(duration, currentTime + 5)
    setCurrentTime(newTime)
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

  const handleDelete = () => {
    if (selectedClip) {
      removeClip(selectedClip.id)
    }
  }

  const handleTrim = () => {
    if (selectedClip && currentTime > selectedClip.startTime && currentTime < selectedClip.endTime) {
      if (currentTime < (selectedClip.startTime + selectedClip.endTime) / 2) {
        updateClip(selectedClip.id, { startTime: currentTime })
      } else {
        updateClip(selectedClip.id, { endTime: currentTime })
      }
    }
  }

  return (
    <div className="h-16 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex items-center gap-4 px-4">

      <button
        onClick={handleTrim}
        disabled={!selectedClip || currentTime <= selectedClip.startTime || currentTime >= selectedClip.endTime}
        className="p-2 rounded-lg bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors"
        aria-label="Trim clip"
        title="Trim clip at playhead"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
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

      <button
        onClick={handleDelete}
        disabled={!selectedClip}
        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors"
        aria-label="Delete clip"
        title="Delete selected clip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div className="flex-1 flex items-center justify-center gap-4">
        <span className="text-sm text-gray-400 dark:text-gray-400 font-mono min-w-[4rem] text-center">
          {formatTime(currentTime)}
        </span>
        
        <button
          onClick={handlePreviousFrame}
          className="p-1 text-gray-400 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
          aria-label="Previous frame"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handlePlayClick}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <button
          onClick={handleNextFrame}
          className="p-1 text-gray-400 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
          aria-label="Next frame"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        <span className="text-sm text-gray-400 dark:text-gray-400 font-mono min-w-[4rem] text-center">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center gap-2 min-w-[200px]">
        <svg className="w-5 h-5 text-gray-300 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
        </svg>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={zoom}
          onChange={handleZoomChange}
          className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <svg className="w-5 h-5 text-gray-300 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          <line x1="16.5" y1="10.5" x2="13.5" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="9" x2="15" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

