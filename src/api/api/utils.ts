import { _cosavVideo } from "../video"
import { pluginName } from "@/symbol"
import { CosavComicPage, CosavVideoPage } from "../page"
import type { cosav } from ".."
import { Utils } from "delta-comic-core"
import { _cosavComic } from "../comic"
import dayjs from 'dayjs'
export const spiltUsers = (userString = '') => userString.split(/\,|，|\&|\||、|＆|(\sand\s)|(\s和\s)|(\s[xX]\s)/ig).filter(Boolean).map(v => v.trim()).filter(Boolean)

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
  author: spiltUsers(v.author),
  commentSendable: false,
  contentType: CosavVideoPage.contentType,
  epLength: 'unknown',
  id: v.id,
  commentNumber: 0,
  title: v.title,
  length: UiDuration(v.duration),
  thisEp: {
    $$plugin: pluginName,
    index: v.group_id,
    name: v.title,
    $$meta: {
      id: v.group_id
    }
  },
  categories: v.tags.map(v => ({
    group: '标签',
    name: v,
    search: {
      keyword: v,
      sort: '',
      source: 'keyword'
    }
  })).concat(
    spiltUsers(v.cos_role).map(v => ({
      group: '角色',
      name: v,
      search: {
        keyword: v,
        sort: '',
        source: 'keyword'
      }
    })),
    spiltUsers(v.cos_works).map(v => ({
      group: '作品',
      name: v,
      search: {
        keyword: v,
        sort: '',
        source: 'keyword'
      }
    }))
  ),
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: new URL(v.photo).pathname.replaceAll('/media', '')
  },
  customIsAI: false,
  likeNumber: Number(v.likes),
  updateTime: Number(v.addtime),
  viewNumber: Number(v.viewnumber)
})

export const createFullVideoToItem = (v: _cosavVideo.RawFullVideo) => new _cosavVideo.CosavVideo({
  $$meta: {
    raw: v
  },
  $$plugin: pluginName,
  author: spiltUsers(v.author).concat([v.company]),
  commentSendable: false,
  contentType: CosavVideoPage.contentType,
  epLength: 'unknown',
  id: v.id,
  commentNumber: 0,
  title: v.title,
  length: UiDuration(v.duration),
  thisEp: {
    $$plugin: pluginName,
    index: v.group_id,
    name: v.title,
    $$meta: {
      id: v.group_id
    }
  },
  categories: v.tags.map(v => ({
    group: '标签',
    name: v,
    search: {
      keyword: v,
      sort: '',
      source: 'keyword'
    }
  })).concat(
    spiltUsers(v.cos_role).map(v => ({
      group: '角色',
      name: v,
      search: {
        keyword: v,
        sort: '',
        source: 'keyword'
      }
    })),
    spiltUsers(v.cos_works).map(v => ({
      group: '作品',
      name: v,
      search: {
        keyword: v,
        sort: '',
        source: 'keyword'
      }
    }))
  ),
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: new URL(v.photo).pathname.replaceAll('/media', '')
  },
  customIsAI: false,
  likeNumber: Number(v.likes),
  updateTime: Number(v.addtime),
  viewNumber: Number(v.viewnumber)
})

export const createCommonComicToItem = (v: _cosavComic.RawCommonComic) => new _cosavComic.CosavComic({
  $$meta: {
    raw: v
  },
  $$plugin: pluginName,
  author: spiltUsers(v.author),
  commentSendable: false,
  contentType: CosavComicPage.contentType,
  epLength: 'unknown',
  id: v.id,
  commentNumber: 0,
  title: v.title,
  length: v.total_photos,
  thisEp: {
    $$plugin: pluginName,
    index: v.id,
    name: v.title
  },
  categories: spiltUsers(v.tags).map(v => ({
    group: '标签',
    name: v,
    search: {
      keyword: v,
      sort: '',
      source: 'keyword'
    }
  })).concat(
    spiltUsers(v.cos_role).map(v => ({
      group: '角色',
      name: v,
      search: {
        keyword: v,
        sort: '',
        source: 'keyword'
      }
    })),
    spiltUsers(v.cos_works).map(v => ({
      group: '作品',
      name: v,
      search: {
        keyword: v,
        sort: '',
        source: 'keyword'
      }
    }))
  ),
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: `/albums/${v.id}.webp`
  },
  customIsAI: false,
  likeNumber: 0,
  updateTime: dayjs(v.adddate, 'YYYY-MM-DD').toDate().getDate(),
  viewNumber: Number(v.total_views),
  description: v.album_desc || ''
})

export const createFullComicToItem = (v: _cosavComic.RawFullComic) => new _cosavComic.CosavComic({
  $$meta: {
    raw: v
  },
  $$plugin: pluginName,
  author: spiltUsers(v.author),
  commentSendable: false,
  contentType: CosavComicPage.contentType,
  epLength: 'unknown',
  id: v.id,
  commentNumber: 0,
  title: v.title,
  length: v.total_photos,
  thisEp: {
    $$plugin: pluginName,
    index: v.id,
    name: v.title
  },
  categories: v.tags.map(v => ({
    group: '标签',
    name: v,
    search: {
      keyword: v,
      sort: '',
      source: 'keyword'
    }
  })).concat(
    spiltUsers(v.cos_role).map(v => ({
      group: '角色',
      name: v,
      search: {
        keyword: v,
        sort: '',
        source: 'keyword'
      }
    })),
    spiltUsers(v.cos_works).map(v => ({
      group: '作品',
      name: v,
      search: {
        keyword: v,
        sort: '',
        source: 'keyword'
      }
    }))
  ),
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: `/albums/${v.id}.webp`
  },
  customIsAI: false,
  likeNumber: Number(v.likes),
  updateTime: dayjs(v.adddate, 'YYYY-MM-DD').toDate().getDate(),
  viewNumber: Number(v.total_views),
  description: v.album_desc || ''
})

export const cosavStream = <T>(api: (page: number, signal: AbortSignal) => PromiseLike<cosav.RawStream<T>>, size = 30) => {
  return Utils.data.Stream.create<T>(async function* (signal, that) {
    while (true) {
      const result = await api(that.page.value, signal)
      that.page.value++
      that.pages.value = (Number(result.totalCnt) / size)
      that.pageSize.value = size
      that.total.value = Number(result.totalCnt)
      yield result.list
      if (result.list.length < size) return
    }
  })
}