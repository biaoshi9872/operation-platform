import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// // import package1 from './package.'
// console.log(package1.dependencies)
const chunksMap = ['element-plus', 'lodash-es', 'axios', 'vue-router', 'vuedraggable', 'vue3-json-viewer', '@ycb']
//const HOST = 'https://supply-test.ycb51.cn' //测试环境
//const HOST = 'https://vsc.ebaoton.cn' //测试环境
//const HOST = 'http://192.168.211.1:9001' //刘康
//const HOST = 'http://192.168.10.29:9001' //晶晶
//const HOST = 'http://192.168.10.234:9001' //旺翔
//const HOST = 'http://192.168.10.249:9001' //双源
const HOST = 'http://192.168.10.50:9001' //刘康
export default defineConfig(({ mode }) => {
  console.log(mode, 'mode')
  return {
    base: '/api_platform/',
    build: {
      target: 'esnext',
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (chunksMap.find(item => id.includes('@ycb'))) {
              console.log(id, 'idddd')
            }
            const chunks = chunksMap.find(item => id.includes(item))
            if (chunks) {
              return chunks
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        },
        external: []
      },
      outDir: mode === 'development' ? 'voperate_admin' : 'dist',
      sourcemap: false
    },
    esbuild:
      mode === 'development'
        ? {}
        : {
          drop: ['console', 'debugger']
        },
    server: {
      port: 7070,
      host: true,
      proxy: {
        '/open-platform': {
          target: HOST,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
        '/assets': {
          target: HOST,
          changeOrigin: true
        }
      }
    },
    optimizeDeps: {
      // 预打包 mavon-editor，避免 Outdated Optimize Dep 504
      include: ['mavon-editor']
    },
    plugins: [
      vue(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: ['vue', 'vue-router'],
        dirs: ['./src/api/**'],
        eslintrc: {
          enabled: false, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        dts: path.resolve(path.resolve(__dirname, 'types'), 'auto-imports.d.ts')
      }),
      Components({
        dirs: ['src/components'],
        resolvers: [
          ElementPlusResolver({
            importStyle: false // 已全局引入样式
          })
        ],
        dts: path.resolve(path.resolve(__dirname, 'types'), 'components.d.ts')
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
        customDomId: '__svg__icons__dom__'
      }),
      Unocss()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/variables.scss" as *; `
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@vue-office/excel/lib/index.css': path.resolve(process.cwd(), 'node_modules/@vue-office/excel/lib/v3/index.css'),
        '@vue-office/excel': path.resolve(process.cwd(), 'node_modules/@vue-office/excel/lib/v3/vue-office-excel.mjs')
      },
      extensions: ['.vue', '.js', '.ts']
    }
  }
})
