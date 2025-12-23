import { useTimeline } from '../../contexts/TimelineContext'
import { formatTime } from '../../utils/timeUtils'

export default function TimelineControls() {
  const { isPlaying, currentTime, duration, setCurrentTime, togglePlay, zoom, setZoom, selectedClip, splitClip, removeClip, updateClip } = useTimeline()

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

  const handleMute = () => {
    if (selectedClip) {
      const isMuted = selectedClip.muted ?? false
      updateClip(selectedClip.id, { muted: !isMuted })
    }
  }

  const canMute = selectedClip && (selectedClip.media.type === 'video' || selectedClip.media.type === 'audio')
  const isMuted = selectedClip?.muted ?? false

  return (
    <div className="h-16 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex items-center gap-4 px-4">

      {canMute && (
        <button
          onClick={handleMute}
          className={`p-2 rounded-lg transition-colors ${
            isMuted 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute clip' : 'Mute clip'}
        >
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M17 10l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      )}

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
              {formatTime(currentTime, true)}
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
              {formatTime(duration, true)}
            </span>
      </div>

      <div className="flex items-center gap-2 min-w-[200px]">
        <svg 
          className="w-5 h-5 text-gray-400 hover:text-gray-300 cursor-pointer transition-colors" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth={2} 
          viewBox="0 0 24 24"
          onClick={() => setZoom(Math.max(0.1, zoom - 0.5))}
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35M8 11h6" />
        </svg>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={zoom}
          onChange={handleZoomChange}
          className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <svg 
          className="w-5 h-5 text-gray-400 hover:text-gray-300 cursor-pointer transition-colors" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth={2} 
          viewBox="0 0 24 24"
          onClick={() => setZoom(Math.min(5, zoom + 0.5))}
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35M8 11h6M11 8v6" />
        </svg>
      </div>
    </div>
  )
}

