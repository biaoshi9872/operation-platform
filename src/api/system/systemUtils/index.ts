import request from '@/utils/axios'
class systemUtils_api {
  /**
   * 地址
   */
  A_address(params: any) {
    return request<any>({
      url: '/district/list',
      method: 'get',
      params
    })
  }

  /**
   * 分类
   */
  A_category(params: any) {
    return request<any>({
      url: '/cate/listAll',
      method: 'get',
      params
    })
  }

  /**
   * vp分类
   */
  A_vpCategory(params: any) {
    return request<any>({
      url: '/cate/vp/listAll',
      method: 'get',
      params
    })
  }

  /**
   * 供应商下拉框
   */
  A_supplierSelect(data: any) {
    return request<any>({
      url: '/supplierManage/supplierSelect',
      method: 'get',
      params: data
    })
  }

  /**
   * 快递公司
   *
   */
  A_getLogisticList() {
    return request<any>({
      url: '/address/express/companyList',
      method: 'post'
    })
  }

  /**
   * 修改物流单号
   *
   */
  A_updateExpress(data: any) {
    return request<any>({
      url: '/order/deliver/update/express',
      method: 'post',
      data: data
    })
  }
}
export default new systemUtils_api()
