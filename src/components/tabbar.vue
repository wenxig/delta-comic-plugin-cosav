<script setup lang='ts'>
import { jm } from '@/api'
import { jmStore } from '@/store'
import { useResizeObserver, until } from '@vueuse/core'
import { Comp, PluginConfigSearchTabbar, Store, Utils } from 'delta-comic-core'
import { isEmpty } from 'es-toolkit/compat'
import { computed, onMounted, ref, shallowRef } from 'vue'
import { ComponentExposed } from 'vue-component-type-helpers'
import { useRouter } from 'vue-router'
const $props = defineProps<{
  isActive: boolean
  tabbar: PluginConfigSearchTabbar
}>()
const $router = useRouter()

const list = shallowRef<ComponentExposed<typeof Comp.Waterfall>>()
const temp = Store.useTemp()
const orderStoreSaveTemp = temp.$applyRaw(`orderJmStoreSave`, () => new Map<string, Utils.data.RStream<jm.comic.JmItem>>())
const orderScrollSaveTemp = temp.$applyRaw(`orderJmScoreSave`, () => new Map<string, number>())
const containBound = ref<DOMRectReadOnly>()
useResizeObserver(() => <HTMLDivElement | null>list.value?.scrollParent?.firstElementChild, ([b]) => containBound.value = b.contentRect)
onMounted(async () => {
  if (!isEmpty(dataSource.value.data.value)) {
    await until(() => (containBound.value?.height ?? 0) > 8).toBeTruthy()
    list.value?.scrollParent?.scroll(0, orderScrollSaveTemp.get($props.tabbar.id) ?? 0)
  }
})
const stop = $router.beforeEach(() => {
  stop()
  orderScrollSaveTemp.set($props.tabbar.id, list.value?.scrollTop ?? 0)
})
const dataSource = computed(() => {
  if (!orderStoreSaveTemp.has($props.tabbar.id))
    orderStoreSaveTemp.set($props.tabbar.id, jm.api.search.createPromoteStream(Number($props.tabbar.id))
      .setupData(jmStore.promotes.value?.find(v => v.id == $props.tabbar.id)?.$content ?? []))
  return orderStoreSaveTemp.get($props.tabbar.id)!
})
</script>

<template>
  <Comp.Waterfall :source="dataSource" v-slot="{ item }" ref="list">
    <Card :item free-height type="small"
      @click="Utils.eventBus.SharedFunction.call('routeToContent', item.contentType, item.id, item.$thisEp.index)" />
  </Comp.Waterfall>
</template>