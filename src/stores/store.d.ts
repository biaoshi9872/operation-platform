declare namespace Store {
  interface UserState {
    userInfo: null | API.UserInfo
    erpUseInfo: null | API.ISupplyErpFrom
    weekMindInfo: any,
    token: string
  }

  interface AppState {
    routeDrawer: boolean
    sidebarOpened: boolean
  }

  interface PictureState {
    curryNode: string
  }
}