import { _cosavVideo } from "../video"
import { pluginName } from "@/symbol"
import { CosavVideoPage } from "../page"

export const UiDuration = (length: string) => {
  const totalSeconds = Math.floor(parseFloat(length))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const stringHours = hours.toString()
  const base = `${minutes.toString()}:${seconds.toString().padStart(2, '0')}`
  if (hours > 0) return `${stringHours}:${base}`
  return base
}

export const createCommonVideoToItem = (v: _cosavVideo.RawCommonVideo) => new _cosavVideo.CosavVideo({
  $$meta: {
    raw: v
  },
  $$plugin: pluginName,
  author: v.author.split(/\s|,/g),
  commentSendable: false,
  contentType: CosavVideoPage.contentType,
  epLength: 'unknown',
  id: v.id,
  commentNumber: 0,
  title: v.title,
  length: UiDuration(v.duration),
  thisEp: {
    $$plugin: pluginName,
    index: v.group_order,
    name: v.title,
    $$meta: {
      id: v.group_id
    }
  },
  categories: [],
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: new URL(v.photo).pathname.replaceAll('/media', '')
  }
})