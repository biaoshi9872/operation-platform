import { computed } from 'vue'

type TisEevCheckHooks = {
  authButtonKey: any
  isDevelopment: boolean
  isUat: ComputedRef<boolean>
}
export default function (data: any): TisEevCheckHooks {
  const { authKey } = data
  const host = window.location.host
  const authButtonKey = computed(() => {
    if (host.includes('localhost')) {
      return authKey //'SUP_PRODUCT_M_ADD'
    } else {
      return authKey
    }
  })
  const isDevUrl = window.location.origin === 'https://supply-test.ycb51.cn'
  const isDevelopment = import.meta.env.VITE_APP_MODE === 'development' || isDevUrl

  //uat环境判断
  const isUat = computed<boolean>(() => {
    let cookie = document.cookie
    console.log('cookie', cookie)
    let host = location.host
    if (cookie.includes('version=always') && host == 'vsc.ebaoton.cn' && import.meta.env.VITE_TAG === 'voperate') {
      return true
    } else return false
  })
  //本地跳过按钮权限配置
  return {
    authButtonKey,
    isDevelopment,
    isUat
  }
}
