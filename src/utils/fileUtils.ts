import type { MediaType } from '../types/media'
import { SUPPORTED_FILE_TYPES, SUPPORTED_VIDEO_TYPES, SUPPORTED_AUDIO_TYPES, SUPPORTED_IMAGE_TYPES, SUPPORTED_TEXT_TYPES } from '../types/media'

export const getMediaType = (file: File): MediaType | null => {
  if (SUPPORTED_VIDEO_TYPES.includes(file.type)) {
    return 'video'
  }
  if (SUPPORTED_AUDIO_TYPES.includes(file.type)) {
    return 'audio'
  }
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return 'image'
  }
  if (SUPPORTED_TEXT_TYPES.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.srt') || file.name.endsWith('.vtt')) {
    return 'text'
  }
  return null
}

export const isValidMediaFile = (file: File): boolean => {
  return SUPPORTED_FILE_TYPES.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.srt') || file.name.endsWith('.vtt')
}

export const isValidVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type)
}

export const isValidAudioFile = (file: File): boolean => {
  return SUPPORTED_AUDIO_TYPES.includes(file.type)
}

export const isValidTextFile = (file: File): boolean => {
  return SUPPORTED_TEXT_TYPES.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.srt') || file.name.endsWith('.vtt')
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const generateMediaId = (): string => {
  return `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
