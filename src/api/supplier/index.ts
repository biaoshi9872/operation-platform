import request from '@/utils/axios'
class supplier_api {
  /**
   * 新增供应商资料
   */
  A_save(data: any) {
    return request<any>({
      url: '/supplierManage/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 供应商资料修改
   */
  A_update(data: any) {
    return request<any>({
      url: '/supplierManage/update',
      method: 'post',
      data: data
    })
  }

  /**
   * 供应商资料-分页列表
   */
  A_page(data: any) {
    return request<API.T_GongYingShangZiLiaoFenYeLieBiaoListRecords[]>({
      url: '/supplierManage/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 供应商 详情
   */
  A_getInfo(data: any) {
    return request<API.T_GongYingShangXiangQingResponses>({
      url: `/supplierManage/getInfo/${data.id}`,
      method: 'get',
      params: data
    })
  }

  /**
   * 自有供应商帐号 新增修改
   */
  A_addOrUpdate(data: any) {
    return request<any>({
      url: '/supplierManage/account/addOrUpdate',
      method: 'post',
      data: data
    })
  }

  /**
   * 自有供应商-帐号列表
   */
  A_list(data: any) {
    return request<API.T_ZiYouGongYingShangZhangHaoLieBiaoListRecords[]>({
      url: '/supplierManage/account/list',
      method: 'post',
      data: data
    })
  }

  /**
   * 供应商下拉
   */
  A_supplierManageGetByOrgId(params: any) {
    return request({
      url: '/supplierManage/getByOrgId',
      method: 'get',
      params: params
    })
  }

  /**
   * 供应商状态
   */
  A_updateStatus(data: any) {
    return request<any>({
      url: '/supplierManage/account/enable',
      method: 'post',
      data: data
    })
  }

  /**
   *
   * 供应商账号导出
   */
  A_supplierAccountExcel(data: any) {
    return request<any>({
      url: '/export/supply/supplierAccountExcel',
      method: 'post',
      data: data
    })
  }

  /**
   *
   * 供应商资料导出
   */
  A_supplierExcel(data: any) {
    return request<any>({
      url: '/export/supply/supplierExcel',
      method: 'post',
      data: data
    })
  }

  /**
   * 供应商角色
   */
  A_getRoleList(data: any) {
    return request({
      url: '/sys/role/supply/list',
      method: 'get',
      data: data
    })
  }
}

export default new supplier_api()
