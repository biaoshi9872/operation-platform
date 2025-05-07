import type { App } from 'vue'
import auth from './auth'
import clickOutside from './clickOutside'
// 权限指令
export default (app: App) => {
  auth(app)
  app.directive('clickOutside', clickOutside)
}
