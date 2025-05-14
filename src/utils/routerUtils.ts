import type { RouteRecordRaw } from 'vue-router'
import { pathToCamel } from '@/utils/tools'
import { getLocal, setLocal } from '@/utils/storage'
import user_api from '@/api/system/user'
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

// 动态路由
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
      hidden: menu.status == 2, //菜单显隐
      meta: {
        title: menu.name,
        icon: menu.icon,
        id: String(menu.id),
        url: menu.url,
        openType: menu.openType || 1,
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

// 路由信息转换
export const getKeepAliveRoutes = (rs: RouteRecordRaw[], breadcrumb: string[], projectId: string): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []
  rs.forEach((item: any) => {
    if (item?.meta?.title) {
      breadcrumb.push(item.meta.title)
    }
    if (item.children && item.children.length > 0) {
      routerList.push(...getKeepAliveRoutes(item.children, breadcrumb, projectId))
    } else {
      item.meta?.breadcrumb.push(...breadcrumb)
      //添加项目
      item.meta.autoParams = {
        projectId: projectId
      }
      routerList.push(item)
    }
    breadcrumb.pop()
  })
  return routerList
}

// 获取第一路由
export const getFistRouters = (routers: any) => {
  let routerPath = '/home'
  console.log(routers)
  let routersList = routers.find((el: any) => el.path === '/')?.children?.filter((el: any) => !el.hidden && el.hasOwnProperty('hidden'))
  if (routersList && routersList.length > 0) {
    routerPath = routersList[0].path
  }
  return routerPath
}

/**
 * 登录成功后动态加载路由
 * @param $userStore
 * @param next
 * @param $routerStore
 * @param router
 * @param asyncRoutes
 * @param constantRoutes
 * @returns
 */
export const getMenuRoutes = async ($userStore: any, next: any, $routerStore: any, router: any, asyncRoutes: any, constantRoutes: any, projectId: string) => {
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
  const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [], projectId)
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
