import { defineStore } from 'pinia'
import { generateRoutes } from '@/utils/routerUtils'
import { RouteRecordRaw } from 'vue-router'
import menu_api from '@/api/system/menu'
import configH5_api from '@/api/configH5'
import { getLocal, removeLocal, setLocal } from '@/utils/storage'
const VITE_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
export const useRouterStore = defineStore('routerStore', {
  state: () => ({
    //菜单
    menuRoutes: [] as RouteRecordRaw[],
    //按钮
    authorityList: [],
    routes: [] as RouteRecordRaw[]
  }),
  actions: {
    async getMenuRoutes() {
      let res = null
      try {
        res = (await menu_api.A_navigationBar({})) as any
        // 隐藏部分菜单
        res = await this.filterRoutes(res)
        //重置
        if (res?.length == 0) {
          //token失效
          removeLocal(VITE_TOKEN_KEY)
          removeLocal('userInfo')
          location.reload()
          return
        }
      } catch (error) {}
      const routes = generateRoutes(res)
      this.setAuthorityList(res as [])
      this.menuRoutes.push(...routes)
      return this.menuRoutes
    },
    async filterRoutes(res: any) {
      const userInfo = getLocal('userInfo')
      const systemConfig: any = await configH5_api.A_getSysConfigList({
        page: 1,
        limit: 10,
        name: '',
        key: 'SYS_HIDE_API_MENU'
      })
      let orgList: string[] = systemConfig?.page?.records?.[0]?.paramValue?.split(',')
      if (orgList.findIndex(item => item == userInfo.orgId) == -1) {
        let index = res.findIndex((item: any) => item.name == 'API对接管理')
        res.splice(index, 1)
      }
      return res
    },
    setRoutes(routers: RouteRecordRaw[]) {
      this.routes = routers
    },
    setAuthorityList(authorList: any[]) {
      let arr = [] as any
      this.getPermList(arr, authorList)
      console.log(arr)
      setLocal('authorList', arr)
      this.authorityList = arr
    },
    getPermList(arr: any, item: any) {
      item.forEach((el: any) => {
        arr.push(el.perms)
        if (el.children) {
          this.getPermList(arr, el.children)
        }
      })
    }
  }
})
