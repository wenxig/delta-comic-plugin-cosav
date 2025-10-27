<script setup lang='ts'>
import { jm } from '@/api'
import { JmBlogPage } from '@/api/page'
import { pluginName } from '@/symbol'
import { parseBlog } from '@/utils/blog'
import { LikeFilled } from '@vicons/antd'
import { ArrowBackIosRound, ChatBubbleOutlineOutlined, PlusRound } from '@vicons/material'
import { Comp, uni, Utils } from 'delta-comic-core'
import { isEmpty } from 'es-toolkit/compat'
import { NScrollbar } from 'naive-ui'
import { Component, computed, shallowRef } from 'vue'

const $props = defineProps<{
  page: JmBlogPage
  comp: {
    FavouriteSelect: Component<{ item: uni.item.Item }>
  }
}>()
const union = computed(() => <jm.blog.JmBlog>$props.page.union.value)
const raw = computed(() => union.value.$$meta.raw)
const parser = new DOMParser()
const content = computed(() => parseBlog(parser.parseFromString(`<div>${raw.value.content}</div>`, 'text/html')))
const user = computed(() => new jm.user.BlogUser(raw.value))
const createURL = (url: string) => new URL(url)

const isLiked = shallowRef(union.value.isLiked ?? false)
const handleLike = Utils.data.PromiseContent.fromAsyncFunction(() => jm.api.blog.likeBlog(union.value.id))

const showComment = shallowRef(union.value.isLiked ?? false)

const CommentEl = window.$comp.Comment
</script>

<template>
  <NScrollbar class="!h-[100vh] relative w-full bg-(--van-background-2) pb-13 overflow-x-hidden">
    <div class="flex relative w-full h-15 items-center">
      <NButton text type="tertiary" @click="$router.back()" class="!absolute left-4">
        <template #icon>
          <NIcon size="30px">
            <ArrowBackIosRound />
          </NIcon>
        </template>
      </NButton>
    </div>
    <div class="text-xl font-semibold w-full px-4">
      {{ union.title }}
    </div>
    <div class="w-full px-4 flex h-15 items-center relative">
      <Comp.Image :src="user.avatar" class="!aspect-square !size-12" round />
      <div class="w-full h-full ml-1 py-3 flex flex-col gap-0.5">
        <div class="text-sm font-semibold">{{ user.name }}</div>
        <div class="text-xs text-(--van-text-color-2)">{{ Utils.translate.createDateString(union.$updateTime) }}</div>
      </div>
      <NButton size="tiny" ghost type="primary" class="!absolute right-4">
        <template #icon>
          <NIcon>
            <PlusRound />
          </NIcon>
        </template>
        关注
      </NButton>
    </div>
    <div v-for="p of content" class="w-full px-4 !text-lg" ref="content">
      <template v-if="p.type == 'textSet'">
        <span v-for="t in p.text" :class="[t.style == 'bold' && 'font-bold']">
          <NButton text size="large"
            @click="Utils.eventBus.SharedFunction.call('routeToContent', t.link.content, t.link.id, t.link.ep)"
            v-if="t.link" type="primary">
            {{ t.text }}
          </NButton>
          <template v-else>{{ t.text }}</template>
        </span>
      </template>
      <template v-else-if="p.type == 'img'">
        <Comp.Image :src="uni.image.Image.create({
          $$plugin: pluginName,
          forkNamespace: 'default',
          path: createURL(p.src).pathname
        }, p.aspect)" previewable class="!bg-(--van-background) !w-full" />
      </template>
      <template v-else-if="p.type == 'empty'">
        <NDivider />
      </template>
    </div>
    <div class="flex-wrap flex px-4 gap-1 w-full mb-2 !text-lg">
      <NButton text size="large" v-for="tag of union.categories" type="primary"
        @click="Utils.eventBus.SharedFunction.call('routeToSearch', tag.search.keyword, `${pluginName}:${tag.search.source}`, tag.search.sort)">
        #{{ tag.name }}
      </NButton>
    </div>
    <div class="flex flex-wrap px-4 gap-1 mb-2 w-full van-hairline--top"
      v-if="!isEmpty(page.recommends.content.data.value)">
      <div class="text-(--p-color) text-lg">相关文章</div>
      <Card free-height :item v-for="item in page.recommends.content.data.value" />
    </div>
    <div class="flex flex-wrap px-4 gap-1 mb-2 w-full van-hairline--top"
      v-if="!isEmpty(page.recommendComics.content.data.value)">
      <div class="text-(--p-color) text-lg">相关漫画</div>
      <Card free-height :item v-for="item in page.recommendComics.content.data.value" />
    </div>
  </NScrollbar>
  <div class="w-full h-13 bg-(--van-background-2) !fixed bottom-0 van-hairline--top flex items-center justify-around">
    <Sender :item="union" :aim="union" />
    <Comp.ToggleIcon padding size="27px" :icon="ChatBubbleOutlineOutlined" dis-changed @click="showComment = true">
      {{ union.commentNumber || '评论' }}
    </Comp.ToggleIcon>
    <Comp.ToggleIcon padding size="27px" v-model="isLiked" @click="handleLike" :icon="LikeFilled">
      {{ union.likeNumber ?? '喜欢' }}
    </Comp.ToggleIcon>
    <component :is="comp.FavouriteSelect" :item="union" />
  </div>
  <Comp.Popup v-model:show="showComment" class="w-full h-[90vh]" round position="bottom">
    <component :is="CommentEl" :item="union" :comments="$props.page.comments" class="h-full" />
  </Comp.Popup>
</template>