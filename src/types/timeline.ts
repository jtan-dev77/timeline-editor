import type { MediaFile } from './media'

export interface TimelineClip {
  id: string
  mediaId: string
  media: MediaFile
  startTime: number
  endTime: number
  trackIndex: number
}

export type TrackType = 'video' | 'audio' | 'text'

export interface TimelineTrack {
  id: string
  type: TrackType
  clips: TimelineClip[]
}

