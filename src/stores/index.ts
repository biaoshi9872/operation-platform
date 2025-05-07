import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import router from '@/router/index'

const store = createPinia()
store.use(({ store }) => {
  store.router = markRaw(router)
})

export * from './modules/app'
export * from './modules/user'
export * from './modules/viewTags'
export * from './modules/router'
export * from './modules/pictureInformation'
export default store
