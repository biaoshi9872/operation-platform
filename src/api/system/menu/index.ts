import request from '@/utils/axios'
class ycb_api {
  /**
   * 菜单管理页面
   */
  A_menuManageTree(data: API.T_CaiDanGuanLiYeMianSearchForm) {
    return request<API.T_CaiDanGuanLiYeMianListRecords[]>({
      url: '/sys/menu/menuManageTree',
      method: 'post',
      data: data
    })
  }

  /**
   * 菜单新增更新
   */
  A_menuSave(data: any) {
    return request<any>({
      url: '/sys/menu/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 删除菜单
   */
  A_menuDelete(id: any) {
    return request<any>({
      url: `/sys/menu/delete/${id}`,
      method: 'post'
    })
  }

  /**
   * 导航栏
   */
  A_navigationBar(data: any) {
    return request<API.T_DaoHangLanListRecords[]>({
      url: '/sys/menu/navigationBar',
      method: 'post',
      data: data
    })
  }

  /**
   * 应用端导航栏
   */
  A_navigationBarForApp(data: any) {
    return request<any>({
      url: '/sys/menu/navigationBarForApp',
      method: 'post',
      data: data
    })
  }

  /**
   * 顶级机构给其他授权
   */
  A_signSelected(data: API.T_DingJiJiGouGeiQiTaShouQuanRequest) {
    return request<any>({
      url: '/sys/menu/signSelected',
      method: 'post',
      data: data
    })
  }
}

export default new ycb_api()
