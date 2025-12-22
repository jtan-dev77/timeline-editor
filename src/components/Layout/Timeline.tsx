import { useTimeline } from '../../contexts/TimelineContext'
import TimelineTrack from '../Timeline/TimelineTrack'
import TimelineControls from '../Timeline/TimelineControls'

const BASE_PIXELS_PER_SECOND = 50

export default function Timeline() {
  const { tracks, zoom, currentTime } = useTimeline()
  const pixelsPerSecond = BASE_PIXELS_PER_SECOND * zoom
  const playheadPosition = currentTime * pixelsPerSecond + 96

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="h-48 overflow-x-auto overflow-y-hidden">
        <div className="relative h-full min-h-[192px]">
          <div
            className="absolute top-0 bottom-0 w-px bg-blue-600 z-20 transition-transform"
            style={{ left: `${playheadPosition}px` }}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
          </div>
          
          <TimelineTrack type="video" clips={tracks[0]} pixelsPerSecond={pixelsPerSecond} />
          <TimelineTrack type="audio" clips={tracks[1]} pixelsPerSecond={pixelsPerSecond} />
          <TimelineTrack type="text" clips={tracks[2]} pixelsPerSecond={pixelsPerSecond} />
        </div>
      </div>
      <TimelineControls />
    </div>
  )
}
