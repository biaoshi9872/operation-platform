import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getLocal, setLocal } from '@/utils/storage'
import { useRouterStore, useUserStore } from '@/stores'
import { isNullOrUnDefOrisEmpty } from '@/utils/is'
import useDBHelper from '@/hooks/dbHelperHooks'
import { getMenuRoutes, getFistRouters } from '@/utils/routerUtils'
import { encrypted, decrypted } from '@/utils/encrypt'

const { initDb } = useDBHelper()
const VITE_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
export const Layout = () => import('@/layout/index.vue')

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('../layout/Router/Redirect.vue')
      }
    ]
  },
  {
    path: '/iframe/:query?',
    component: () => import('../layout/Router/Iframe.vue')
  },
  {
    path: '/login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/middlePage',
    component: () => import('../views/middlePage.vue')
  },
  {
    path: '/404',
    component: () => import('../views/404.vue'),
    hidden: true
  }
]

const asyncRoutes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [
    {
      path: '/downloadCenter',
      name: 'DownloadCenter',
      component: () => import('../views/downloadCenter/index.vue'),
      meta: {
        title: '下载中心',
        cache: false
      }
    }
  ]
}

// 白名单列表
const whiteList = ['/login']

const router = createRouter({
  history: createWebHistory('api_platform'),
  routes: constantRoutes
})

router.beforeEach(async (to, from, next) => {
  const userToken = getLocal(VITE_TOKEN_KEY)
  const $routerStore = useRouterStore()
  const $userStore = useUserStore()
  try {
    // token存在的情况
    if (userToken) {
      if (to.path === '/login') {
        await getMenuRoutes($userStore, next, $routerStore, router, asyncRoutes, constantRoutes, '')
        const routerPath = getFistRouters($routerStore.routes)
        next(routerPath)
      } else {
        // 用户信息不存在，则重新拉取用户等信息
        if (isNullOrUnDefOrisEmpty($userStore.userInfo?.id)) {
          await getMenuRoutes($userStore, next, $routerStore, router, asyncRoutes, constantRoutes, '')
          next({ ...to, replace: true })
        } else {
          next()
        }
      }
    } else {
      // 没有token的情况下，可以进入白名单
      if (whiteList.indexOf(to.path) > -1) {
        next()
      } else {
        next({ path: '/login', query: { ...to.query } })
      }
    }
  } catch (error) {
    console.log('路由跳转错误', error)
  }
})
router.afterEach(to => {
  if (to.meta.title) {
    document.title = `V链API开发平台-${to.meta.title}`
  }
})

export default router
