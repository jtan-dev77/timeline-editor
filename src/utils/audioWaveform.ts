export interface WaveformData {
  peaks: number[]
  duration: number
}

export async function generateAudioWaveform(
  audioFile: File,
  samples: number = 200
): Promise<WaveformData> {
  return new Promise((resolve, reject) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const fileReader = new FileReader()

      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          if (!arrayBuffer) {
            throw new Error('Failed to read file as ArrayBuffer')
          }

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0))
          
          if (!audioBuffer || audioBuffer.length === 0) {
            throw new Error('Invalid audio buffer')
          }

          const rawData = audioBuffer.getChannelData(0)
          if (!rawData || rawData.length === 0) {
            throw new Error('No audio data in channel')
          }

          const blockSize = Math.max(1, Math.floor(rawData.length / samples))
          const peaks: number[] = []

          for (let i = 0; i < samples; i++) {
            const start = blockSize * i
            let max = 0
            let min = 0

            for (let j = 0; j < blockSize && (start + j) < rawData.length; j++) {
              const sample = rawData[start + j]
              max = Math.max(max, sample)
              min = Math.min(min, sample)
            }

            const peak = Math.max(Math.abs(max), Math.abs(min))
            peaks.push(peak)
          }

          resolve({
            peaks,
            duration: audioBuffer.duration,
          })
        } catch (error) {
          console.error('Error generating waveform:', error)
          reject(error)
        } finally {
          audioContext.close().catch(() => {})
        }
      }

      fileReader.onerror = (error) => {
        console.error('FileReader error:', error)
        reject(new Error('Failed to read audio file'))
      }

      fileReader.readAsArrayBuffer(audioFile)
    } catch (error) {
      console.error('Error creating AudioContext:', error)
      reject(error)
    }
  })
}

export function normalizeWaveform(peaks: number[]): number[] {
  const max = Math.max(...peaks)
  if (max === 0) return peaks
  return peaks.map(peak => peak / max)
}

