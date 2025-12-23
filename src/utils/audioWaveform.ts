export interface WaveformData {
  peaks: number[]
  duration: number
}

export async function generateAudioWaveform(
  audioFile: File,
  samples: number = 200
): Promise<WaveformData> {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const fileReader = new FileReader()

    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        
        const rawData = audioBuffer.getChannelData(0)
        const blockSize = Math.floor(rawData.length / samples)
        const peaks: number[] = []

        for (let i = 0; i < samples; i++) {
          const start = blockSize * i
          let sum = 0
          let max = 0
          let min = 0

          for (let j = 0; j < blockSize; j++) {
            const sample = rawData[start + j]
            sum += Math.abs(sample)
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
        reject(error)
      } finally {
        audioContext.close()
      }
    }

    fileReader.onerror = () => {
      reject(new Error('Failed to read audio file'))
    }

    fileReader.readAsArrayBuffer(audioFile)
  })
}

export function normalizeWaveform(peaks: number[]): number[] {
  const max = Math.max(...peaks)
  if (max === 0) return peaks
  return peaks.map(peak => peak / max)
}

