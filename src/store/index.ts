import type { jm } from "@/api"
import type { Utils } from "delta-comic-core"
import { useLocalStorage } from '@vueuse/core'
import { ref, shallowRef } from "vue"
export namespace jmStore {
  export const api = shallowRef<Utils.request.Requester>()
  export const loginToken = shallowRef<string | undefined>()
  export const loginAvs = shallowRef<string | undefined>()
  export const loginData = useLocalStorage<jm.auth.LoginData>('jm.auth.LoginData', {
    username: '',
    password: ''
  })
  export const user = shallowRef<jm.user.UserMe>()
  export const useredit = ref<jm.user.UserEdit>()

  export const promotes = shallowRef<jm.search.Promote[]>()
  export const wb = shallowRef<jm.search.WeekBestList>()
}
window.$api.jmStore = jmStore