import { defineStore } from 'pinia'
import { getLocal, removeLocal, setLocal } from '@/utils/storage'
import user_api from '@/api/system/user'
import useDBHelper from '@/hooks/dbHelperHooks'

const { initDb } = useDBHelper()
const VITE_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
interface UserState {
  userInfo: any
  token: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    userInfo: {},
    token: getLocal(VITE_TOKEN_KEY) || ''
  }),
  getters: {},
  actions: {
    updateUserInfo(info: API.T_DangQianYongHuXinXiResponses) {
      this.userInfo = markRaw(info)
      setLocal(VITE_TOKEN_KEY, `${info.token}`)
    },
    async initInfo() {
      initDb()
    },
    async reSetUserInfo() {
      return user_api.A_logout().then(() => {
        removeLocal(VITE_TOKEN_KEY)
        removeLocal('userInfo')
      })
    },
    async clearInfo() {
      removeLocal(VITE_TOKEN_KEY)
      removeLocal('userInfo')
    }
  }
})
