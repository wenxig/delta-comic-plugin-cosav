import { cosavStore } from "@/store"
import { uni, Utils } from "delta-comic-core"
import type { cosav } from ".."
import { createFullComicToItem } from "./utils"
import { pluginName } from "@/symbol"

export namespace _cosavApiComic {
  const { PromiseContent } = Utils.data
  export const getInfo = PromiseContent.fromAsyncFunction((id: string, signal?: AbortSignal) => cosavStore.api.value!.get<cosav.comic.RawFullComic>('/albums/albuminfo', { signal, params: { id } }).then<cosav.comic.CosavComic>(createFullComicToItem))


  export const getPages = PromiseContent.fromAsyncFunction((id: string, signal?: AbortSignal) =>
    cosavStore.api.value!.get<{ latest: string[] }>('/albums/album_content', { signal, params: { id, limit: 999 } })
      .then<uni.image.Image[]>(v => v.latest.map(v => uni.image.Image.create({
        $$plugin: pluginName,
        forkNamespace: 'default',
        path: new URL(v).pathname.replaceAll('/media', '')
      })))
  )
}