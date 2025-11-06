import type { App } from 'vue'
import auth from './auth'
import clickOutside from './clickOutside'
import clipboardGuard from './clipboardGuard'
// 权限指令
export default (app: App) => {
  auth(app)
  app.directive('clickOutside', clickOutside)
  // 全局复制拦截/规范化
  clipboardGuard(app)
}
