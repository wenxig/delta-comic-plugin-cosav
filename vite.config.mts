import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver, VantResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import _package from './package.json'
import monkey from 'vite-plugin-monkey'
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import external from 'vite-plugin-external'
import { createExternalConfig, createMonkeyConfig } from 'delta-comic-core/vite'
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      dts: true,
      resolvers: [
        NaiveUiResolver(),
        VantResolver()
      ],
    }),
    tailwindcss(),
    monkey(createMonkeyConfig({
      name: 'cosav',
      displayName: 'cos天堂',
      version: _package.version,
      supportCoreVersion: '>=0.2.2',
      author: _package.author.name,
      description: _package.description,
      require: ['core']
    }, command)),
    external(createExternalConfig(command))
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('> 1%, last 2 versions, not ie <= 8'))
    }
  },
  build: {
    sourcemap: false,
    // minify: true,
    // cssMinify: true
  },
  server: {
    port: 6173
  },
  base: "/",
} satisfies UserConfigExport))
