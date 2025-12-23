export type MediaType = 'video' | 'audio' | 'image' | 'text'

export interface MediaFile {
  id: string
  name: string
  type: MediaType
  file: File
  url: string
  thumbnail?: string
  duration?: number
  size: number
  content?: string
  waveform?: number[]
}

export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']
export const SUPPORTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/mp4', 'audio/x-m4a']
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
export const SUPPORTED_TEXT_TYPES = ['text/plain', 'text/vtt', 'application/x-subrip', 'text/srt']

export const SUPPORTED_FILE_TYPES = [
  ...SUPPORTED_VIDEO_TYPES,
  ...SUPPORTED_AUDIO_TYPES,
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_TEXT_TYPES,
]
