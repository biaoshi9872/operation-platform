import request from '@/utils/axios'
class ycb_api {
  /**
   * 新增角色编辑角色
   */
  A_roleSave(data: API.T_XinZengJueSeBianJiJueSeRequest) {
    return request<any>({
      url: '/sys/role/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 角色列表
   */
  A_rolePageList(data: API.T_JueSeLieBiaoSearchForm) {
    return request<API.T_JueSeLieBiaoListRecords[]>({
      url: '/sys/role/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 删除角色
   */
  A_roleDelete(id: any) {
    return request<any>({
      url: `/sys/role/delete/${id}`,
      method: 'post'
    })
  }

  /**
   * 权限页面角色列表
   */
  A_permissionRoleList(data: API.T_QuanXianYeMianJueSeLieBiaoSearchForm) {
    return request<API.T_QuanXianYeMianJueSeLieBiaoListRecords[]>({
      url: '/sys/role/permissionRoleList',
      method: 'post',
      data: data
    })
  }

  /**
   * 新增用户角色列表下拉框
   */
  A_addUserRoleList(data: any) {
    return request<API.T_XinZengYongHuJueSeLieBiaoXiaLaKuangListRecords[]>({
      url: '/sys/role/addUserRoleList',
      method: 'post',
      params: data
    })
  }

  /**
   * 查询角色勾选的权限
   */
  A_permissionList(data: API.T_ChaXunJueSeGouXuanDeQuanXianRequest) {
    return request<any>({
      url: '/sys/role/permissionList',
      method: 'get',
      params: data
    })
  }

  /**
   * 设置角色权限
   */
  A_setPermission(data: any) {
    return request<any>({
      url: '/sys/role/setPermission',
      method: 'post',
      data: data
    })
  }
}

export default new ycb_api()
