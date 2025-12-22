import type { TimelineClip as TimelineClipType } from '../../types/timeline'

interface TimelineClipProps {
  clip: TimelineClipType
  pixelsPerSecond: number
  onSelect?: (clip: TimelineClipType) => void
}

export default function TimelineClip({ clip, pixelsPerSecond, onSelect }: TimelineClipProps) {
  const width = (clip.endTime - clip.startTime) * pixelsPerSecond
  const left = clip.startTime * pixelsPerSecond

  const getClipColor = () => {
    switch (clip.media.type) {
      case 'video':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'audio':
        return 'bg-green-500 hover:bg-green-600'
      case 'text':
        return 'bg-purple-500 hover:bg-purple-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  return (
    <div
      className={`absolute h-full ${getClipColor()} rounded cursor-pointer transition-colors flex items-center px-2 text-white text-xs font-medium shadow-md border border-white/20`}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 60)}px`,
        zIndex: 1,
      }}
      onClick={() => onSelect?.(clip)}
      title={clip.media.name}
    >
      <span className="truncate">{clip.media.name}</span>
    </div>
  )
}

