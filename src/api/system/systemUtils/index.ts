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
   * 供应商下拉框
   */
  A_supplierSelect(data: any) {
    return request<any>({
      url: '/supplierManage/supplierSelect',
      method: 'get',
      data: data
    })
  }
}
export default new systemUtils_api()
