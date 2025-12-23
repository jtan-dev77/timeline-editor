export const formatTime = (seconds: number, includeMs: boolean = false): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  
  if (includeMs) {
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const parseTime = (timeString: string, fallback: number = 0): number => {
  const parts = timeString.split(':')
  if (parts.length === 2) {
    const [mins, secs] = parts
    const [sec, ms] = secs.split('.')
    const minutes = parseInt(mins) || 0
    const seconds = parseInt(sec) || 0
    const milliseconds = parseInt(ms || '0') || 0
    return minutes * 60 + seconds + (milliseconds / 100)
  }
  return fallback
}

