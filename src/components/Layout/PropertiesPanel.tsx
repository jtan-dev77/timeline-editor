import { useState, useEffect } from 'react'
import { useTimeline } from '../../contexts/TimelineContext'
import { formatTime, parseTime } from '../../utils/timeUtils'

export default function PropertiesPanel() {
  const { selectedClip, updateClip } = useTimeline()
  const [trimExpanded, setTrimExpanded] = useState(true)
  const [speedExpanded, setSpeedExpanded] = useState(true)
  const [opacityExpanded, setOpacityExpanded] = useState(true)
  const [tempStartTime, setTempStartTime] = useState<string>('')
  const [tempEndTime, setTempEndTime] = useState<string>('')
  const [tempSpeed, setTempSpeed] = useState<string>('')
  const [fontSizeExpanded, setFontSizeExpanded] = useState(true)
  const [colorExpanded, setColorExpanded] = useState(true)

  useEffect(() => {
    if (selectedClip) {
      setTempStartTime(formatTime(selectedClip.startTime, true))
      setTempEndTime(formatTime(selectedClip.endTime, true))
      const currentSpeed = selectedClip.speed ?? 1
      setTempSpeed(currentSpeed.toFixed(1))
    }
  }, [selectedClip, selectedClip?.speed])

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

        const newStartTime = parseTime(tempStartTime, selectedClip.startTime)
        const newEndTime = parseTime(tempEndTime, selectedClip.endTime)
        const isVideoOrAudio = selectedClip.media.type === 'video' || selectedClip.media.type === 'audio'
        const originalDuration = selectedClip.originalDuration ?? (selectedClip.media.duration ?? (selectedClip.endTime - selectedClip.startTime))

        if (newStartTime >= 0 && newStartTime < newEndTime && newEndTime > newStartTime) {
          let finalStartTime = newStartTime
          let finalEndTime = newEndTime

          if (isVideoOrAudio) {
            const maxDuration = originalDuration
            const requestedDuration = newEndTime - newStartTime
            
            if (requestedDuration > maxDuration) {
              finalEndTime = newStartTime + maxDuration
            }
          }

          updateClip(selectedClip.id, {
            startTime: finalStartTime,
            endTime: finalEndTime,
          })
        } else {
          setTempStartTime(formatTime(selectedClip.startTime, true))
          setTempEndTime(formatTime(selectedClip.endTime, true))
        }
      }

      const handleResetTrim = () => {
        if (selectedClip.media.duration) {
          updateClip(selectedClip.id, {
            startTime: 0,
            endTime: selectedClip.media.duration,
          })
          setTempStartTime(formatTime(0, true))
          setTempEndTime(formatTime(selectedClip.media.duration, true))
        }
      }

  const handleSpeedSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value)
    const roundedSpeed = Math.round(speed * 10) / 10
    setTempSpeed(roundedSpeed.toFixed(1))
    updateClip(selectedClip.id, { speed: roundedSpeed })
  }

  const handleSpeedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSpeed(e.target.value)
  }

  const handleSpeedInputBlur = () => {
    const speed = parseFloat(tempSpeed)
    if (!isNaN(speed) && speed >= 0.1 && speed <= 16) {
      updateClip(selectedClip.id, { speed })
      setTempSpeed(speed.toFixed(1))
    } else {
      setTempSpeed((selectedClip.speed ?? 1).toFixed(1))
    }
  }

  const handleSpeedInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseFloat(e.target.value)
    updateClip(selectedClip.id, { opacity })
  }


  const duration = selectedClip.endTime - selectedClip.startTime
  const isVideo = selectedClip.media.type === 'video'
  const isText = selectedClip.media.type === 'text'

  const textStyle = selectedClip.textStyle || {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Arial',
    alignment: 'middle-center',
    bold: false,
    italic: false,
  }

  const handleTextStyleUpdate = (updates: Partial<typeof textStyle>) => {
    updateClip(selectedClip.id, {
      textStyle: { ...textStyle, ...updates },
    })
  }

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Properties
        </h2>
      </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {!isText && (
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
                  <span className="text-sm font-mono text-yellow-500 dark:text-yellow-400">{formatTime(duration, true)}</span>
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
                            const newTime = parseTime(tempStartTime, selectedClip.startTime) + 0.01
                            setTempStartTime(formatTime(Math.max(0, newTime), true))
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => {
                            const newTime = parseTime(tempStartTime, selectedClip.startTime) - 0.01
                            setTempStartTime(formatTime(Math.max(0, newTime), true))
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
                        const currentEndTime = parseTime(tempEndTime, selectedClip.endTime)
                        const newTime = currentEndTime + 0.01
                        setTempEndTime(formatTime(newTime, true))
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none"
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const currentEndTime = parseTime(tempEndTime, selectedClip.endTime)
                        const newTime = currentEndTime - 0.01
                        const minTime = parseTime(tempStartTime, selectedClip.startTime) + 0.01
                        setTempEndTime(formatTime(Math.max(minTime, newTime), true))
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
        )}

        {!isText && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Speed</h3>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempSpeed}
                onChange={handleSpeedInputChange}
                onBlur={handleSpeedInputBlur}
                onKeyDown={handleSpeedInputKeyDown}
                className="w-16 px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">x</span>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    const currentSpeed = parseFloat(tempSpeed) || (selectedClip.speed ?? 1)
                    const newSpeed = Math.min(16, Math.round((currentSpeed + 0.1) * 10) / 10)
                    setTempSpeed(newSpeed.toFixed(1))
                    updateClip(selectedClip.id, { speed: newSpeed })
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none p-0.5"
                >
                  ▲
                </button>
                <button
                  onClick={() => {
                    const currentSpeed = parseFloat(tempSpeed) || (selectedClip.speed ?? 1)
                    const newSpeed = Math.max(0.1, Math.round((currentSpeed - 0.1) * 10) / 10)
                    setTempSpeed(newSpeed.toFixed(1))
                    updateClip(selectedClip.id, { speed: newSpeed })
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none p-0.5"
                >
                  ▼
                </button>
              </div>
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
                value={parseFloat(tempSpeed) || (selectedClip.speed ?? 1)}
                onChange={handleSpeedSliderChange}
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
        )}

        {isVideo && (
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
        )}

        {isText && (
          <>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Text</h3>
                </div>
              </div>
              <div>
                <textarea
                  value={selectedClip.media.content || 'Enter your text here'}
                  onChange={(e) => {
                    const updatedMedia = { ...selectedClip.media, content: e.target.value }
                    updateClip(selectedClip.id, { media: updatedMedia })
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter your text here"
                />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Font Size</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 text-sm font-medium">
                    {textStyle.fontSize || 24}px
                  </button>
                  <button
                    onClick={() => setFontSizeExpanded(!fontSizeExpanded)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <svg className={`w-4 h-4 transition-transform ${fontSizeExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {fontSizeExpanded && (
                <div>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    step="1"
                    value={textStyle.fontSize || 24}
                    onChange={(e) => handleTextStyleUpdate({ fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>12px</span>
                    <span>120px</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Color</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600" style={{ backgroundColor: textStyle.color || '#FFFFFF' }}></div>
                  <button
                    onClick={() => setColorExpanded(!colorExpanded)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <svg className={`w-4 h-4 transition-transform ${colorExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {colorExpanded && (
                <div className="space-y-3">
                  <input
                    type="color"
                    value={textStyle.color || '#FFFFFF'}
                    onChange={(e) => handleTextStyleUpdate({ color: e.target.value })}
                    className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Alignment</h3>
                </div>
              </div>
              <div>
                <select
                  value={textStyle.alignment || 'middle-center'}
                  onChange={(e) => handleTextStyleUpdate({ alignment: e.target.value as typeof textStyle.alignment })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="middle-left">Middle Left</option>
                  <option value="middle-center">Middle Center</option>
                  <option value="middle-right">Middle Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 4a2 2 0 100 4 2 2 0 000-4zm0 0c-1.306 0-2.417.835-2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Font Family</h3>
                </div>
              </div>
              <div>
                <select
                  value={textStyle.fontFamily || 'Arial'}
                  onChange={(e) => handleTextStyleUpdate({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Palatino">Palatino</option>
                  <option value="Garamond">Garamond</option>
                </select>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 4a2 2 0 100 4 2 2 0 000-4zm0 0c-1.306 0-2.417.835-2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Style</h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={textStyle.bold || false}
                    onChange={(e) => handleTextStyleUpdate({ bold: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-bold">Bold</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={textStyle.italic || false}
                    onChange={(e) => handleTextStyleUpdate({ italic: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100 italic">Italic</span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
