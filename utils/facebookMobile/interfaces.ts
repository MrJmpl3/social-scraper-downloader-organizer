export interface Context {
  waitTime: number
}

export interface Album {
  id: string
  name: string
  url: string
}

export interface PhotoViewer {
  url: string
}

export interface Photo {
  type: 'original' | 'alt'
  url: string
}
