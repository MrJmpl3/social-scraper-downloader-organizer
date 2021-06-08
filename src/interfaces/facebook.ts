export interface Context {
  waitTime: number
}

export interface Album {
  id: string
  name: string
  photoViewers: PhotoViewer[]
  url: string
}

export interface Data {
  albums: Album[]
  url: string
  version: number
}

export interface PhotoViewer {
  photo: Photo
  url: string
}

export interface Photo {
  downloaded: boolean
  url: string
}
