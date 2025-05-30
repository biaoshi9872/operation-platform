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
}

export default new supplier_api()
