import request from '@/utils/axios'
class restrictedSalesArea_api {
  /**
   * 限售模板-地址列表
   */
  A_areaTree(data: any) {
    return request<API.T_XianShouMuBanDiZhiLieBiaoListRecords[]>({
      url: '/address/limit/areaTree',
      method: 'get',
      data: data
    })
  }

  /**
   * 限售模板-新增
   */
  A_addTemplate(data: any) {
    return request<API.T_XianShouMuBanXinZengListRecords[]>({
      url: '/address/limit/addTemplate',
      method: 'post',
      data: data
    })
  }

  /**
   * 限售模板-修改
   */
  A_updTemplate(data: any) {
    return request<API.T_XianShouMuBanXiuGaiListRecords[]>({
      url: '/address/limit/updTemplate',
      method: 'post',
      data: data
    })
  }

  /**
   * 限售模板-详情
   */
  A_getDetail(id: any) {
    return request<API.T_XianShouMuBanXiangQingResponses>({
      url: `/address/limit/detail/${id}`,
      method: 'get'
    })
  }

  /**
   * 限售模板-删除
   */
  A_delTemplate(id: any) {
    return request<API.T_XianShouMuBanShanChuResponses>({
      url: `/address/limit/delTemplate/${id}`,
      method: 'get'
    })
  }

  /**
   * 限售模板-列表
   */
  A_page(data: any) {
    return request<API.T_XianShouMuBanLieBiaoResponses>({
      url: '/address/limit/template/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 显示所有下拉
   */
  A_allList() {
    const data = {
      page: 1,
      limit: 100000
    }
    return request({
      url: '/address/limit/template/page',
      method: 'post',
      data: data
    })
  }
}
export default new restrictedSalesArea_api()
