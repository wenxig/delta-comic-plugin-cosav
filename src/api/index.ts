import { _cosavApiSearch } from "./api/search"
import { _cosavVideo } from "./video"
import { _cosavSearch } from "./search"
import { _cosavApiVideo } from "./api/video"

export namespace cosav {
  export type SearchMode = 'vid' | 'keyword' | 'category'
  export type SortType = '' | 'mv' | 'mr'
  export interface RawStream<T> {
    lastpage: number
    list: T[]
    totalCnt: string
  }
  export const sortMap = []

  export import search = _cosavSearch
  export import video = _cosavVideo
}

export namespace cosav.api {
  export import search = _cosavApiSearch
  export import video = _cosavApiVideo
}

window.$api.cosav = cosav