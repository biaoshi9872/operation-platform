import { defineStore } from 'pinia'
import { generateRoutes } from '@/utils/routerUtils'
import { RouteRecordRaw } from 'vue-router'
import menu_api from '@/api/system/menu'
import configH5_api from '@/api/configH5'
import org_api from '@/api/system/org'
import { getLocal, removeLocal, setLocal } from '@/utils/storage'
const VITE_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY

type HideMenuConfigItem = {
  orgId?: Array<number | string>
  level?: number
}

type HideMenuConfig = Record<string, HideMenuConfigItem>

export const useRouterStore = defineStore('routerStore', {
  state: () => ({
    //菜单
    menuRoutes: [] as RouteRecordRaw[],
    //按钮
    authorityList: [],
    //配置新消息
    config: getLocal('config') || {},
    routes: [] as RouteRecordRaw[]
  }),
  actions: {
    getHideMenuConfigValue(config: any, keys: string[]) {
      if (!config || typeof config !== 'object') return ''
      for (const key of keys) {
        const value = config[key]
        if (typeof value === 'string' && value.trim()) {
          return value
        }
      }
      return ''
    },
    parseHideMenuConfig(configValue: string): HideMenuConfig {
      try {
        const config = JSON.parse(configValue || '{}')
        return config && typeof config === 'object' ? config : {}
      } catch (error) {
        return {}
      }
    },
    filterOrgHideMenus(menuList: any[], orgHideConfig: HideMenuConfig, userOrgId: number | string, depth = 1) {
      if (!Array.isArray(menuList) || !menuList.length) return []
      const currentOrgId = String(userOrgId)
      return menuList.reduce((list: any[], menu: any) => {
        const rule = orgHideConfig?.[menu?.name]
        if (!rule) {
          const nextMenu = { ...menu }
          if (Array.isArray(nextMenu.children) && nextMenu.children.length > 0) {
            nextMenu.children = this.filterOrgHideMenus(nextMenu.children, orgHideConfig, currentOrgId, depth + 1)
          }
          list.push(nextMenu)
          return list
        }

        const orgIdList = Array.isArray(rule.orgId) ? rule.orgId.map(item => String(item)) : []
        const isSameLevel = Number(rule.level) === depth
        const shouldShow = isSameLevel && orgIdList.includes(currentOrgId)
        const shouldHide = isSameLevel && !shouldShow
        if (shouldHide) {
          return list
        }

        const nextMenu = { ...menu }
        if (Array.isArray(nextMenu.children) && nextMenu.children.length > 0) {
          nextMenu.children = this.filterOrgHideMenus(nextMenu.children, orgHideConfig, currentOrgId, depth + 1)
        }

        list.push(nextMenu)
        return list
      }, [])
    },
    async getMenuRoutes() {
      let res = null
      try {
        const config = await configH5_api.A_getValueFromCache({})
        setLocal('config', config)
        this.config = config || {}
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
      //1.隐藏 赔付订单菜单
      const orgInfo: any = await org_api.A_getOrgDetail(userInfo.orgId)
      let hasTamil = orgInfo.goodsOrgMarkupDTOList
        .filter((item: any) => !!item.priceMarkupType)
        .map((item: any) => item.goodsSourceId)
        .includes(63)
      if (!hasTamil && userInfo.orgType != 1) {
        let orderIndex = res.findIndex((item: any) => item.name == '订单管理')
        let orderInfo = res[orderIndex]
        let index = orderInfo?.children?.findIndex((item: any) => item.name == '赔付订单')
        if (index > -1) {
          orderInfo.children.splice(index, 1)
        }
      }
      //2.动态隐藏 机构菜单
      const cacheConfig = this.config || getLocal('config') || {}
      let orgHideConfigValue = this.getHideMenuConfigValue(cacheConfig, ['orgHideConfig', 'SYS_HIDE_MENU_ORG', 'sysHideMenuOrg'])
      if (!orgHideConfigValue) {
        const orgSystemConfig: any = await configH5_api.A_getSysConfigList({
          page: 1,
          limit: 10,
          name: '',
          key: 'SYS_HIDE_MENU_ORG'
        })
        orgHideConfigValue = orgSystemConfig?.page?.records?.[0]?.paramValue || ''
      }
      const orgHideConfig = this.parseHideMenuConfig(orgHideConfigValue)
      res = this.filterOrgHideMenus(res, orgHideConfig, userInfo.orgId)
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
