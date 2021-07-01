export interface ContextProfiles {
  session: string;
}

export type VideoType = 'normal' | 'advance' | 'advanceplus';

export interface Data {
  id: string;
  version: number;
  videos: {
    id: string;
    type: VideoType;
  }[];
}
