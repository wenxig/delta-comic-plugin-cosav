import { _cosavVideo } from "./video"

export namespace cosav {
  export type SearchMode = 'vid' | 'keyword' | 'category'
  export type SortType = '' | 'mv' | 'mr'
  export interface RawStream<T> {
    lastpage: number
    list: T[]
    totalCnt: string
  }
  export const sortMap = []

  export import video = _cosavVideo
}

export namespace cosav.api {


}

window.$api.cosav = cosav