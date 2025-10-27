import { Store } from 'delta-comic-core'
import { pluginName } from './symbol'
export const config = (Store.useConfig().$useCustomConfig(pluginName, {
  doubleImage: {
    type: 'switch',
    info: '漫画阅读时: 同时显示两张图片',
    defaultValue: false
  },
  preloadImage: {
    type: 'number',
    info: '漫画阅读时: 图片预加载数量',
    defaultValue: 2,
    float: false,
    range: [1, 10]
  }
}))