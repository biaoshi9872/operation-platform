/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_BASE_API: string
  readonly VITE_TOKEN_KEY: string
  readonly VITE_TAG: string
  readonly VITE_TAG_VALUE: string
  readonly VITE_DB: string
  readonly VITE_FIELDS_DB: string
  readonly VITE_FIELDS_VERSION: number
  readonly VITE_DB_VERSION: number
  readonly VITE_BASE_PATH: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ViteEnv extends ImportMetaEnv {}

declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module 'vue3-json-viewer'
