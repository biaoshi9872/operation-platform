import { defineStore } from 'pinia'


//图片状态库
export const pictureStore = defineStore({
  id: 'pictureStore',
  state: (): Store.PictureState => ({
    curryNode: '',
  }),
  getters: {
    getCurryNode(): string {
      return this.curryNode
    }
  },
  actions: {
    setCurryNode(id: string): void {
      this.curryNode = id
    }
  }
})