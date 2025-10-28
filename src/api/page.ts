import { pluginName } from "@/symbol"
import { uni, Utils } from "delta-comic-core"

export class CosavVideoPage extends uni.content.ContentPage {
  public static contentType = uni.content.ContentPage.toContentType({
    name: 'video',
    plugin: pluginName
  })
  override contentType = CosavVideoPage.contentType
  override comments = Utils.data.Stream.create<uni.comment.Comment>(function* () {
    return
  })
  override loadAll(signal?: AbortSignal): Promise<any> {
    throw new Error("Method not implemented.")
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
  override ViewComp!: uni.content.ViewComp
}