interface WaveformProps {
  peaks: number[]
  width: number
  height: number
  color?: string
  backgroundColor?: string
}

export default function Waveform({ 
  peaks, 
  width, 
  height, 
  color = '#10b981',
  backgroundColor = 'transparent'
}: WaveformProps) {
  if (!peaks || peaks.length === 0) {
    return null
  }

  const barWidth = Math.max(1, width / peaks.length)
  const maxBarHeight = height * 0.9
  const centerY = height / 2
  const minBarHeight = 1

  return (
    <svg
      width={width}
      height={height}
      style={{ display: 'block' }}
      preserveAspectRatio="none"
    >
      <rect width={width} height={height} fill={backgroundColor} />
      {peaks.map((peak, index) => {
        const barHeight = Math.max(minBarHeight, peak * maxBarHeight)
        const x = index * barWidth
        const y = centerY - barHeight / 2

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={Math.max(0.5, barWidth * 0.8)}
            height={barHeight}
            fill={color}
            opacity={0.9}
          />
        )
      })}
    </svg>
  )
}

