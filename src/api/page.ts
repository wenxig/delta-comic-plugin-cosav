import { pluginName } from "@/symbol"
import { coreModule, requireDepend, uni, Utils } from "delta-comic-core"
import { cosav } from "."
import { createCommonComicToItem, createCommonVideoToItem } from "./api/utils"
const { view } = requireDepend(coreModule)
export class CosavVideoPage extends uni.content.ContentPage {
  public static contentType = uni.content.ContentPage.toContentTypeString({
    name: 'video',
    plugin: pluginName
  })
  override contentType = uni.content.ContentPage.toContentType(CosavVideoPage.contentType)
  override comments = Utils.data.Stream.create<uni.comment.Comment>(function* () {
    return
  })
  override loadAll(signal?: AbortSignal): Promise<any> {
    this.pid.resolve(this.id)
    return Promise.all([
      this.eps.content.isLoading.value || this.eps.content.loadPromise(this.loadEps(signal)),
      this.detail.content.isLoading.value || this.detail.content.loadPromise(cosav.api.video.getInfo(this.id, signal).then((v: cosav.video.CosavVideo) => {
        const raw = <cosav.video.RawFullVideo>v.$$meta.raw
        this.recommends.resolve(raw.cnxh.map(createCommonVideoToItem))
        this.videos.resolve(raw.video_url_vip.concat(raw.video_url))
        return v
      }))
    ])
  }
  public videos = Utils.data.PromiseContent.withResolvers<string[]>(true)
  public videoType = 'application/vnd.apple.mpegurl'
  public async loadEps(signal?: AbortSignal) {
    const video = (<cosav.video.CosavVideo>this.union.value)
    if (video.$$meta.raw.group_id == "0") return [video.$thisEp]
    const info = await cosav.api.search.utils.video.byGroupId(video.$$meta.raw.group_id, undefined, undefined, signal)
    return info.list.map(v => {
      const raw = v.$$meta.raw as cosav.video.RawCommonVideo
      return new uni.ep.Ep({
        $$plugin: pluginName,
        index: raw.group_id,
        name: v.title
      })
    })
  }
  override reloadAll(signal?: AbortSignal): Promise<any> {
    throw new Error("Method not implemented.")
  }
  override plugin = pluginName
  override loadAllOffline(): Promise<any> {
    throw new Error("Method not implemented.")
  }
  override exportOffline(save: any): Promise<any> {
    throw new Error("Method not implemented.")
  }
  override ViewComp = view.Video
}


export class CosavComicPage extends uni.content.ContentPage {
  public static contentType = uni.content.ContentPage.toContentTypeString({
    name: 'comic',
    plugin: pluginName
  })
  override contentType = uni.content.ContentPage.toContentType(CosavVideoPage.contentType)
  override comments = Utils.data.Stream.create<uni.comment.Comment>(function* () {
    return
  })
  override loadAll(signal?: AbortSignal): Promise<any> {
    this.pid.resolve(this.id)
    return Promise.all([
      this.detail.content.isLoading.value || this.detail.content.loadPromise(cosav.api.comic.getInfo(this.id, signal).then(v => {
        const raw = v.$$meta.raw as cosav.comic.RawFullComic
        this.recommends.resolve(raw.related?.map(createCommonComicToItem) ?? [])
        return v
      })),
      this.images.content.isLoading.value || this.images.content.loadPromise(cosav.api.comic.getPages(this.id, signal)),
    ])
  }
  public images = Utils.data.PromiseContent.withResolvers<uni.image.Image[]>(false)
  override reloadAll(signal?: AbortSignal): Promise<any> {
    throw new Error("Method not implemented.")
  }
  override plugin = pluginName
  override loadAllOffline(): Promise<any> {
    throw new Error("Method not implemented.")
  }
  override exportOffline(save: any): Promise<any> {
    throw new Error("Method not implemented.")
  }
  override ViewComp = view.Images
}
