import router from '@/router'
import { defineStore } from 'pinia'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { getComponentName, disUpdated } from '@/utils/tools'
import { nextTick } from 'vue'
import { useRouterStore } from '@/stores'

export const tabsStore = defineStore('tabsStore', {
  state: () => ({
    visitedViews: [] as any[],
    cachedViews: [] as any[]
    
  }),
  actions: {
    addView(view: RouteLocationNormalizedLoaded) {
      const pathKey = view?.meta?.openType == 2 ? view.path + '_' + JSON.stringify(view.query) : view.path
      if (this.visitedViews.some(value => value.pathKey === pathKey)) {
        return
      }
      this.visitedViews.push({
        ...view,
        pathKey,
        title: view.query?.tabTitle || view.meta?.title || 'unknown',
        query: {
          ...view.query
        },
        params: {
          ...view.params
        }
      })
    },
    //关闭并重新
    reload(view: any) {
      this.delView(view)
      this.delCachedView(view)

      nextTick(() => {
        //@ts-ignore
        this.router.push(view)
      })
    },

    close(curryView: any, toView: any) {
      this.delView(curryView)
      this.delCachedView(curryView)
      nextTick(() => {
        //@ts-ignore
        this.router.push(toView)
        disUpdated(toView.path)
      })
    },
    addCachedView(view: RouteLocationNormalizedLoaded) {
      const componentName = getComponentName()
      if (this.cachedViews.includes(componentName)) {
        return
      }
      if (view.meta.cache) {
        this.cachedViews.push(componentName)
      }
    },
    delView(view: RouteLocationNormalizedLoaded) {
      const pathKey = view?.meta?.openType == 2 ? view.path + '_' + JSON.stringify(view.query) : view.path
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.pathKey === pathKey) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
      this.delCachedView(view).then()
    },
    delCachedView(view: RouteLocationNormalizedLoaded) {
      let allRoutesArr: any = []
      const menuRoutes = useRouterStore()?.menuRoutes
      menuRoutes?.forEach((item: any) => {
        this.getMenuRoutes(item.children, allRoutesArr)
      })
      const cacheName = allRoutesArr.find((item: any) => item.path === view.path || item.name == view.name)?.meta?.cacheName
      return new Promise(resolve => {
        const index = this.cachedViews.indexOf(cacheName)
        if (index > -1) {
          this.cachedViews.splice(index, 1)
        }
        resolve([...this.cachedViews])
      })
    },
    //获取
    getMenuRoutes(children: any, allRoutes: any) {
      children.map((item: any) => {
        allRoutes.push(item)
        if (item.children) {
          this.getMenuRoutes(item.children, allRoutes)
        }
      })
    },
    delOthersViews(view: RouteLocationNormalizedLoaded) {
      const pathKey = view?.meta?.openType == 2 ? view.path + '_' + JSON.stringify(view.query) : view.path
      this.visitedViews = this.visitedViews.filter(v => {
        return v.meta.affix || v.pathKey === pathKey
      })
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        this.cachedViews = []
      }
    },
    delAllViews() {
      this.visitedViews = this.visitedViews.filter(tab => tab.meta.affix)
      this.cachedViews = []
    },
    // 跳转到最后一个tab
    toLastView(router: any, view: any) {
      const latestView = this.visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        if (view.name === 'Home') {
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    },

    // 关闭全部tabs
    closeAllTabs(router: any, tab: any) {
      this.delAllViews()
      this.toLastView(router, tab)
    },

    // 关闭其他tabs
    closeOthersTabs(router: any, tab: any) {
      router.push(tab)
      this.delOthersViews(tab)
    },
    // 关闭其他tabs
    closeTab(router: any, tab: any) {
      if (tab.meta?.affix) return
      this.delView(tab)
      this.toLastView(router, tab)
    },
    delViews(view: RouteLocationNormalizedLoaded, type: 'left' | 'right') {
      const pathKey = view?.meta?.openType == 2 ? view.path + '_' + JSON.stringify(view.query) : view.path
      const curryIndex = this.visitedViews.findIndex((item: any) => item.pathKey === pathKey)
      if (type === 'left') {
        this.visitedViews.splice(0, curryIndex)
      } else if (type === 'right') {
        this.visitedViews.splice(curryIndex + 1, this.visitedViews.length - 1)
      }
      router.push(view.fullPath)
      console.log(this.visitedViews)
      this.delCachedView(view).then()
    },
    // 关闭右边
    closeRightTabs(router: any, tab: any) {
      this.delViews(tab, 'right')
    },
    // 关闭左边
    closeLeftTabs(router: any, tab: any) {
      this.delViews(tab, 'left')
    }
  }
})
