<script setup lang='ts'>
import { jm } from '@/api'
import { Comp, Store, uni, Utils } from 'delta-comic-core'
import { VueDraggable } from 'vue-draggable-plus'
import { until, createReusableTemplate } from '@vueuse/core'
import { differenceBy } from 'es-toolkit/compat'
import { computed, ref, triggerRef, watch } from 'vue'
import { shallowRef } from 'vue'
import { jmStore } from '@/store'
import { pluginName } from '@/symbol'
await until(jmStore.user).toBeTruthy()
const temp = Store.useTemp().$apply('jm:change', () => ({
  allMyOwn: jm.api.user.badge.getMy()
}))
const allList = ref<jm.user.RawBadge[]>([])
watch(() => temp.allMyOwn.data.value, v => {
  const user = jmStore.user.value?.customUser.user
  if (!v || !user) return
  allList.value = differenceBy(v, user.badges, v => v.id)
}, { immediate: true })


const myList = ref<jm.user.RawBadge[]>([])
watch(jmStore.user, user => {
  if (!user) return
  myList.value = user.customUser.user.badges
}, { immediate: true })

const countLimitCheck = () => {
  if (myList.value.length >= 5) {
    // const last = myList.value.at(-1)!
    // myList.value.pop()
    // allList.value.unshift(last)
    return false
  }
}
const [Def, Com] = createReusableTemplate<{
  item: jm.user.RawBadge
  index?: number
}>()

const previewUser = computed(() => new jm.user.UserMe({
  ...jmStore.user.value!.customUser.user,
  badges: myList.value
}))


const isReordering = shallowRef(false)
const reorderBadge = (item: jm.user.RawBadge[]) => Utils.message.createLoadingMessage('排序中').bind(Promise.try(async () => {
  if (isReordering.value) throw '排序中'
  isReordering.value = true

  await jm.api.user.badge.changeOrder(item.map(v => v.id))

  jmStore.user.value!.customUser.user.badges = myList.value
  uni.user.User.userBase.set(pluginName, jmStore.user.value!)
  triggerRef(jmStore.user)

  const my = jm.api.user.badge.getMy()
  await my
  temp.allMyOwn = my

  isReordering.value = false
})).catch(() => { isReordering.value = false })
</script>

<template>
  <Def v-slot="{ item, index }">
    <div
      class="flex flex-col items-start justify-center aspect-7/3 bg-(--van-gray-1) rounded relative overflow-hidden shrink-0">
      <Comp.Image :src="uni.image.Image.create({
        $$plugin: pluginName,
        forkNamespace: 'default',
        path: item.content
      }, { width: 1, height: 1 })" class="aspect-square h-4/5 ml-1" />
      <div
        class="absolute bottom-0 translate-y-1/4 right-0 translate-x-1/6 text-(--p-color) z-0 text-[20vw] italic font-bold opacity-20"
        v-if="index">#{{ index }}</div>
      <div class="absolute bottom-2 bg-white !right-1 rounded-full px-1 shadow text-nowrap opacity-85">{{ item.name }}
      </div>
    </div>
  </Def>
  <NSpin :show="isReordering" class="!size-full *:!size-full">
    <Comp.Content :source="temp.allMyOwn" class="h-full flex flex-col" v-if="jmStore.user">
      <div class="w-full h-[calc(100%-40px)] flex flex-col">
        <NCard title="预览" size="small">
          <User :user="previewUser" />
        </NCard>
        <div class="flex justify-around flex-1 min-h-0">
          <VueDraggable :onMove="countLimitCheck"
            class="flex flex-col gap-2 p-4 w-[calc(50%-8px)] bg-(--van-background-2) rounded overflow-auto min-h-0"
            v-model="allList" :animation="150" ghostClass="ghost" group="people">
            <Com v-for="item in allList" :key="item.id" :item />
          </VueDraggable>
          <VueDraggable
            class="flex flex-col gap-2 p-4 w-[calc(50%-8px)] bg-(--van-background-2) rounded overflow-auto min-h-0"
            v-model="myList" :animation="150" group="people" ghostClass="ghost">
            <Com :index="index + 1" v-for="(item, index) in myList" :key="item.id" :item />
          </VueDraggable>
        </div>
      </div>
      <VanButton @click="reorderBadge(myList)" block class="!rounded-none !h-10" size="large" type="primary">确认更新
      </VanButton>
    </Comp.Content>
  </NSpin>
</template>