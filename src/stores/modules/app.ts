import { defineStore } from 'pinia'
import { clearLocal, getLocal, removeLocal, setLocal } from '@/utils/storage'

interface AppState {
  routeDrawer: boolean
  sidebarOpened: boolean
  homeTheme: 'home-theme2' | 'home-theme1'
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    routeDrawer: true,
    sidebarOpened: getLocal('sidebarOpened'),
    homeTheme: 'home-theme1'
  }),
  getters: {
    getRouteDrawer(): boolean {
      return this.routeDrawer
    }
  },
  actions: {
    setSidebarOpened() {
      this.sidebarOpened = !this.sidebarOpened
      setLocal('sidebarOpened', this.sidebarOpened)
    },
    toggleRouteDrawer(flag: boolean): void {
      this.routeDrawer = flag
    },
    logout() {
      this.routeDrawer = true
      clearLocal()
      location.reload()
    }
  }
})
