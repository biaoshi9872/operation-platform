import type { App } from 'vue'
import { useRouterStore } from '@/stores'
const bindingValue = async (el: any, binding: any) => {
  //ERP特殊权限处理
  const $routerStore = useRouterStore()
  if (Object.prototype.toString.call(binding.value) === '[object Object]') {
    //判断是否为ERP账号
    const { authKey, detail } = binding.value
    if (!$routerStore.authorityList.some((v: string) => v === authKey) && authKey) {
      if (el && el.parentNod) {
        el.parentNode.removeChild(el)
      } else {
        el.style.display = "none"
      }
    }
  } else {
    if (!$routerStore.authorityList.some((v: string) => v === binding.value) && binding.value) {
      if (el && el.parentNod) {
        el.parentNode.removeChild(el)
      } else {
        el.style.display = "none"
      }
    }
  }
}
export default function auth(app: App) {

  // 权限验证
  app.directive('auth', {
    mounted(el, binding) {
      bindingValue(el, binding)
    },

    updated(el: any, binding: any) {
      bindingValue(el, binding)
    }
  })
}
