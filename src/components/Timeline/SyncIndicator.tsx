import { useTimeline } from '../../contexts/TimelineContext'

export default function SyncIndicator() {
  const { tracks, zoom } = useTimeline()
  const pixelsPerSecond = 50 * zoom

  const allClips = tracks.flat()
  const syncPoints = new Map<number, number>()

  allClips.forEach((clip) => {
    const startTime = clip.startTime
    syncPoints.set(startTime, (syncPoints.get(startTime) || 0) + 1)
  })

  const syncLines = Array.from(syncPoints.entries())
    .filter(([, count]) => count > 1)
    .map(([time]) => time)

  return (
    <>
      {syncLines.map((time) => {
        const position = time * pixelsPerSecond + 96
        return (
          <div
            key={`sync-${time}`}
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 opacity-50 z-15 pointer-events-none"
            style={{ left: `${position}px` }}
          />
        )
      })}
    </>
  )
}

