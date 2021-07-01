export interface Context {
  session: string;
}

export type TypePost = 'normal' | 'advance' | 'advanceplus';

export interface Data {
  id: string;
  version: number;
  videos: {
    id: string;
    type: TypePost;
  }[];
}
