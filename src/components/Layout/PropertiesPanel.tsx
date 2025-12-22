import { useState, useEffect } from 'react'
import { useTimeline } from '../../contexts/TimelineContext'

export default function PropertiesPanel() {
  const { selectedClip, updateClip } = useTimeline()
  const [trimExpanded, setTrimExpanded] = useState(true)
  const [speedExpanded, setSpeedExpanded] = useState(true)
  const [opacityExpanded, setOpacityExpanded] = useState(true)
  const [tempStartTime, setTempStartTime] = useState<string>('')
  const [tempEndTime, setTempEndTime] = useState<string>('')

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const parseTime = (timeString: string): number => {
    const parts = timeString.split(':')
    if (parts.length === 2) {
      const [mins, secs] = parts
      const [sec, ms] = secs.split('.')
      const minutes = parseInt(mins) || 0
      const seconds = parseInt(sec) || 0
      const milliseconds = parseInt(ms || '0') || 0
      return minutes * 60 + seconds + (milliseconds / 100)
    }
    return selectedClip?.startTime || 0
  }

  useEffect(() => {
    if (selectedClip) {
      setTempStartTime(formatTime(selectedClip.startTime))
      setTempEndTime(formatTime(selectedClip.endTime))
    }
  }, [selectedClip])

  if (!selectedClip) {
    return (
      <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Properties
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Select a clip to edit its properties
        </div>
      </div>
    )
  }

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempStartTime(e.target.value)
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempEndTime(e.target.value)
  }

  const handleApplyTrim = () => {
    if (!selectedClip) return

    const newStartTime = parseTime(tempStartTime)
    const newEndTime = parseTime(tempEndTime)

    if (newStartTime >= 0 && newStartTime < newEndTime && newEndTime > newStartTime) {
      updateClip(selectedClip.id, {
        startTime: newStartTime,
        endTime: newEndTime,
      })
    } else {
      setTempStartTime(formatTime(selectedClip.startTime))
      setTempEndTime(formatTime(selectedClip.endTime))
    }
  }

  const handleResetTrim = () => {
    if (selectedClip.media.duration) {
      updateClip(selectedClip.id, {
        startTime: 0,
        endTime: selectedClip.media.duration,
      })
    }
  }

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value)
    updateClip(selectedClip.id, { speed })
  }

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseFloat(e.target.value)
    updateClip(selectedClip.id, { opacity })
  }


  const duration = selectedClip.endTime - selectedClip.startTime

  if (selectedClip.media.type !== 'video') {
    return (
      <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Properties
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Video properties are only available for video clips
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Properties
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Trim</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetTrim}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                title="Reset trim"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <span className="text-sm font-mono text-yellow-500 dark:text-yellow-400">{formatTime(duration)}</span>
              <button
                onClick={() => setTrimExpanded(!trimExpanded)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <svg className={`w-4 h-4 transition-transform ${trimExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {trimExpanded && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Time</label>
                <div className="relative">
                  <input
                    type="text"
                    value={tempStartTime}
                    onChange={handleStartTimeChange}
                    placeholder="00:00.00"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-yellow-400 rounded border border-gray-300 dark:border-gray-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-0.5">
                    <button
                      onClick={() => {
                        const newTime = parseTime(tempStartTime) + 0.01
                        setTempStartTime(formatTime(Math.max(0, newTime)))
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => {
                        const newTime = parseTime(tempStartTime) - 0.01
                        setTempStartTime(formatTime(Math.max(0, newTime)))
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Time</label>
                <div className="relative">
                  <input
                    type="text"
                    value={tempEndTime}
                    onChange={handleEndTimeChange}
                    placeholder="00:00.00"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-0.5">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const currentEndTime = parseTime(tempEndTime) || selectedClip.endTime
                        const newTime = currentEndTime + 0.01
                        setTempEndTime(formatTime(newTime))
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none"
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const currentEndTime = parseTime(tempEndTime) || selectedClip.endTime
                        const newTime = currentEndTime - 0.01
                        const minTime = (parseTime(tempStartTime) || selectedClip.startTime) + 0.01
                        setTempEndTime(formatTime(Math.max(minTime, newTime)))
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApplyTrim}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
              >
                Trim
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Speed</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 text-sm font-medium">
                {selectedClip.speed ?? 1}x
              </button>
              <button
                onClick={() => setSpeedExpanded(!speedExpanded)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <svg className={`w-4 h-4 transition-transform ${speedExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {speedExpanded && (
            <div>
              <input
                type="range"
                min="0.1"
                max="16"
                step="0.1"
                value={selectedClip.speed ?? 1}
                onChange={handleSpeedChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>0.1x</span>
                <span>0.5x</span>
                <span>1x</span>
                <span>4x</span>
                <span>16x</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Opacity</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 text-sm font-medium">
                {Math.round(selectedClip.opacity ?? 100)}%
              </button>
              <button
                onClick={() => setOpacityExpanded(!opacityExpanded)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <svg className={`w-4 h-4 transition-transform ${opacityExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {opacityExpanded && (
            <div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={selectedClip.opacity ?? 100}
                onChange={handleOpacityChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
