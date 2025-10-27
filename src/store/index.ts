import type { Utils } from "delta-comic-core"
import { shallowRef } from "vue"
export namespace cosavStore {
  export const api = shallowRef<Utils.request.Requester>()
}
window.$api.cosavStore = cosavStore