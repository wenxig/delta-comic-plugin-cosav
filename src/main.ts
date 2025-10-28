import "@/index.css"
import { definePlugin, uni, Utils } from "delta-comic-core"
import { pluginName } from "./symbol"
import { AES, MD5, enc, mode, pad } from 'crypto-js'
import { api, image } from "./api/forks"
import { fromPairs, inRange, isString } from 'es-toolkit/compat'
import axios, { formToJSON } from 'axios'
import { cosavStore } from "./store"
import { cosav } from "./api"
import Tabbar from "./components/tabbar.vue"
const testAxios = axios.create({
  timeout: 10000,
  method: 'GET',
  validateStatus(status) {
    return inRange(status, 199, 499)
  },
})
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
    test: '/photos/1205243/00001.webp'
  },
  onBooted: ins => {
    console.log('setup...', ins, ins.api?.api)
    if (ins.api?.api) {
      const f = ins.api.api
      const api = Utils.request.createAxios(() => f, {}, ins => {
        const cosKey = 'CosAppMakeBigMoneyCosplayAPPContent'
        const key = MD5(cosKey).toString()
        const keyHex = enc.Utf8.parse(key)
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
      Utils.eventBus.SharedFunction.define(s => jm.api.search.getRandomComics(s).then(v => v.list), pluginName, 'getRandomProvide')
    }
  },
  content: {
  },
  otherProgress: [{
    name: '预加载数据',
    async call(setDescription) {
      setDescription('获取分类 & 推荐等...')
      try {
        const [] = await Promise.all([
          
        ])
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
        name: '关键词',
        getStream(input, sort) {
          return cosav.api.search.utils.createKeywordStream(input, <cosav.SortType>sort)
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