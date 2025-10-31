import "@/index.css"
import { coreModule, definePlugin, requireDepend, uni, Utils, type PluginConfigSearchTabbar } from "delta-comic-core"
import { pluginName } from "./symbol"
import { AES, MD5, enc, mode, pad } from 'crypto-js'
import { api, image } from "./api/forks"
import { inRange, isString } from 'es-toolkit/compat'
import axios, { formToJSON } from 'axios'
import { cosavStore } from "./store"
import { cosav } from "./api"
import Tabbar from "./components/tabbar.vue"
import Card from "./components/card.vue"
import { CosavComicPage, CosavVideoPage } from "./api/page"
import ComicCard from "./components/comicCard.vue"
const testAxios = axios.create({
  timeout: 10000,
  method: 'GET',
  validateStatus(status) {
    return inRange(status, 199, 499)
  },
})
const { layout } = requireDepend(coreModule)
testAxios.interceptors.response.use(undefined, Utils.request.utilInterceptors.createAutoRetry(testAxios, 2))
definePlugin({
  name: pluginName,
  api: {
    api: {
      forks: () => Promise.resolve(api),
      test: (fork, signal) => testAxios.get(`${fork}/promote_list`, { signal })
    }
  },
  image: {
    forks: {
      default: image
    },
    test: '/videos/tmb/30859/0.jpg'
  },
  onBooted: ins => {
    console.log('setup...', ins, ins.api?.api)
    if (ins.api?.api) {
      const f = ins.api.api
      const api = Utils.request.createAxios(() => f, {}, ins => {
        const cosKey = 'CosAppMakeBigMoneyCosplayAPPContent'
        const key = MD5(cosKey).toString()
        const keyHex = enc.Utf8.parse(key)
        ins.interceptors.request.use(async requestConfig => {
          const key = Date.now().toString()
          const tokenParam = `CosAppMakeBigMoney,${Math.floor(Date.now() / 1000)}`
          requestConfig.cosav_key = key
          requestConfig.headers.set('userParams', '')
          requestConfig.headers.set('Tokenparam', tokenParam)
          requestConfig.headers.set('Use-interface', requestConfig.baseURL)
          return requestConfig
        })
        ins.interceptors.response.use(res => {
          const decrypt = (cipherText: string) => {
            const dData = AES.decrypt(cipherText, keyHex, {
              mode: mode.ECB,
              padding: pad.Pkcs7
            })
            const result = dData.toString(enc.Utf8)
            return JSON.parse(result)
          }
          if (!res.data.data) return res
          if (isString(res.data)) {
            res.data = JSON.parse(res.data.replace(/}\[.+/gims, '}'))
          }
          if (isString(res.data.data)) res.data = decrypt(res.data.data)
          const data = res.config.data instanceof FormData ? formToJSON(res.config.data) : res.config.data
          console.log('response', res.config.url, data ?? res.config.params ?? {}, '->', res.data)
          return res
        })
        return ins
      })
      cosavStore.api.value = api
      Utils.eventBus.SharedFunction.define(s => cosav.api.search.getRandomVideo(s), pluginName, 'getRandomProvide')
      Utils.eventBus.SharedFunction.define(s => cosav.api.search.getRandomComic(s), pluginName + '2', 'getRandomProvide')
    }
  },
  content: {
    contentPage: {
      [CosavVideoPage.contentType]: CosavVideoPage,
      [CosavComicPage.contentType]: CosavComicPage
    },
    itemCard: {
      [CosavVideoPage.contentType]: Card,
      [CosavComicPage.contentType]: ComicCard,
    },
    layout: {
      [CosavVideoPage.contentType]: layout.Default,
      [CosavComicPage.contentType]: layout.Default,
      
    }
  },
  otherProgress: [{
    name: '预加载数据',
    async call(setDescription) {
      setDescription('获取分类 & 推荐等...')
      try {
        const [settings, categories] = await Promise.all([
          cosav.api.search.getSettings(),
          cosav.api.search.getVideoCategories()
        ])
        cosavStore.settings.value = settings
        for (const page of settings.$index_page) {
          uni.content.ContentPage.setMainList(pluginName, {
            content: () => Utils.data.PromiseContent.resolve(page.list),
            name: page.name,
            onClick() {
              return Utils.eventBus.SharedFunction.call('routeToSearch', '')
            },
          })
        }
        cosavStore.categories.value = categories
        uni.content.ContentPage.setTabbar(pluginName, ...categories.map(v => (<PluginConfigSearchTabbar>{
          comp: Tabbar,
          id: v.CHID,
          title: v.name
        })))
        setDescription('成功')
      } catch (error) {
        setDescription('失败')
        throw error
      }
    }
  }
  ],
  search: {
    methods: {
      keyword: {
        name: '视频',
        getStream(input, sort) {
          return cosav.api.search.utils.video.createKeywordStream(input, <cosav.SortType>sort)
        },
        sorts: cosav.sortMap,
        defaultSort: '',
        async getAutoComplete(_input, _signal) {
          return []
        },
      },
      cos: {
        name: '图集',
        getStream(input, sort) {
          return cosav.api.search.utils.comic.createKeywordStream(input, <cosav.SortType>sort)
        },
        sorts: cosav.sortMap,
        defaultSort: '',
        async getAutoComplete(_input, _signal) {
          return []
        },
      },
    }
  }
})