import { defineStore } from 'pinia'
import { generateRoutes } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import menu_api from '@/api/system/menu'
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
        //重置
        if (res?.length == 0) {
          //token失效
          removeLocal(VITE_TOKEN_KEY)
          removeLocal('userInfo')
          location.reload()
          return
        }
      } catch (error) { }
      const routes = generateRoutes(res)
      this.setAuthorityList(res as [])
      this.menuRoutes.push(...routes)
      return this.menuRoutes
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
