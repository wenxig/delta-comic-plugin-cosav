import type { cosav } from "."

export interface CommonPicture {
  id: string
  title: string
  tags: string
  photo: string
  ct: string
  cos_works: string
  cos_role: string
  author: string
  total_photos: string
  total_views: string
  addtime: string
  adddate: string
  type: string
  album_desc?: string
  username?: string
  uid: string
}
export type ifAlbumList = cosav.RawStream<CommonPicture>

export interface FullPicture {
  adddate: string
  addtime: string
  album_desc?: string
  author: string
  cos_role: string
  cos_works: string
  ct: string
  ct_name: string
  dislikes: string
  id: string
  likes: string
  rate_view: string
  tags: string[]
  title: string
  total_photos: string
  total_views: string
  type: string
  uid: string
  user_avatar: string
  username: string
}
export type ifAlbumContentApiResponse = cosav.RawStream<string>
