import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getLocal, setLocal } from '@/utils/storage'
import { pathToCamel } from '@/utils/tools'
import { useRouterStore, useUserStore } from '@/stores'
import { isNullOrUnDefOrisEmpty } from '@/utils/is'
import useDBHelper from '@/hooks/dbHelperHooks'
import user_api from '@/api/system/user'
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
  },
  {
    path: '/menu',
    component: () => import('../views/system/menu/index.vue')
  },
  {
    path: '/role',
    component: () => import('../views/system/role/index.vue')
  },
  {
    path: '/org',
    component: () => import('../views/system/org/index.vue')
  },
  {
    path: '/user',
    component: () => import('../views/system/user/index.vue')
  },
  {
    path: '/auth',
    component: () => import('../views/system/auth/index.vue')
  }
]

// 加载vue组件
const layoutModules = import.meta.glob('/src/views/**/*.vue')
const layoutModulesInfo = import.meta.glob('/src/views/**/*.vue', { eager: true })
// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string): any => {
  return layoutModules[`/src/views/${path}.vue`]
}

//根据路径获取组件名称
const getDynamicComponentInfo = (path: string): any => {
  return layoutModulesInfo[`/src/views/${path}.vue`]?.default?.name
}

// 根据菜单列表，生成路由数据
export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []
  menuList.forEach((menu: any) => {
    let component
    let path
    let componentName
    const menuChildren = menu.children.filter((item: any) => item.level != 2)
    if (menu.children && menu.level == 3 && menuChildren.length > 0) {
      component = () => import('@/layout/index.vue')
      path = '/p/' + menu.id
    } else {
      component = getDynamicComponent(menu.url)
      path = '/' + menu.url
      componentName = getDynamicComponentInfo(menu.url)
    }
    const route: RouteRecordRaw = {
      path: path,
      name: pathToCamel(path),
      component: component,
      children: [],
      hidden: menu.status == 0, //菜单显隐
      meta: {
        title: menu.name,
        icon: menu.icon,
        id: String(menu.id),
        url: menu.url,
        openType: menu.menuType || 1,
        cache: menu?.isCache == 1 ? true : false,
        isColumnCache: menu?.isColumnCache == 1 ? true : false,
        breadcrumb: [],
        cacheName: componentName
      }
    }
    // 有子菜单的情况
    if (menu.children && menu.level == 3 && menuChildren.length > 0) {
      route.children?.push(...generateRoutes(menu.children))
    }
    routerList.push(route)
  })
  return routerList
}
// 获取扁平化路由，将多级路由转换成一级路由
export const getKeepAliveRoutes = (rs: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []
  rs.forEach((item: any) => {
    if (item?.meta?.title) {
      breadcrumb.push(item.meta.title)
    }
    if (item.children && item.children.length > 0) {
      routerList.push(...getKeepAliveRoutes(item.children, breadcrumb))
    } else {
      item.meta?.breadcrumb.push(...breadcrumb)
      routerList.push(item)
    }
    breadcrumb.pop()
  })
  return routerList
}

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

const getMenuRoutes = async ($userStore: any, next: any, $routerStore: any) => {
  try {
    const userInfo = await user_api.A_info({})
    setLocal('userInfo', userInfo)
    //initDb()
    $userStore.updateUserInfo(userInfo)
  } catch (error) {
    // 请求异常，则跳转到登录页
    $userStore.clearInfo()
    next('/login')
    return Promise.reject(error)
  }
  const menuRoutes = await $routerStore.getMenuRoutes()
  // 根据后端菜单路由，生成KeepAlive路由
  const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])
  // 新增菜单路由
  asyncRoutes.children.push(...keepAliveRoutes)
  router.addRoute(asyncRoutes)
  router.addRoute({
    name: 'NoPermission',
    path: '/:catchAll(.*)',
    component: () => import('../views/noPermission.vue')
  })
  // 保存路由数据
  $routerStore.setRoutes(constantRoutes.concat(asyncRoutes))
}

const getFistRouters = (routers: any) => {
  let routerPath = '/home'
  console.log(routers)
  let routersList = routers.find((el: any) => el.path === '/')?.children?.filter((el: any) => !el.hidden && el.hasOwnProperty('hidden'))
  if (routersList && routersList.length > 0) {
    routerPath = routersList[0].path
  }
  return routerPath
}

router.beforeEach(async (to, from, next) => {
  const userToken = getLocal(VITE_TOKEN_KEY)
  const $routerStore = useRouterStore()
  const $userStore = useUserStore()
  try {
    // token存在的情况
    if (userToken) {
      if (to.path === '/login') {
        await getMenuRoutes($userStore, next, $routerStore)
        const routerPath = getFistRouters($routerStore.routes)
        next(routerPath)
      } else {
        // 用户信息不存在，则重新拉取用户等信息
        if (isNullOrUnDefOrisEmpty($userStore.userInfo?.id)) {
          await getMenuRoutes($userStore, next, $routerStore)
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
        next('/login')
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
