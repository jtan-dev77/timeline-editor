import type { MediaFile } from './media'

export interface TimelineClip {
  id: string
  mediaId: string
  media: MediaFile
  startTime: number
  endTime: number
  trackIndex: number
  originalDuration?: number
  opacity?: number
  audioLevel?: number
  speed?: number
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion'
  textStyle?: {
    fontSize?: number
    color?: string
    fontFamily?: string
    alignment?: 'left' | 'center' | 'right'
    bold?: boolean
    italic?: boolean
  }
}

export type TrackType = 'video' | 'audio' | 'text'

export interface TimelineTrack {
  id: string
  type: TrackType
  clips: TimelineClip[]
}

