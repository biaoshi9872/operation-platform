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
      url: '/sys/systemUtils/category',
      method: 'get',
      params
    })
  }
}
export default new systemUtils_api()
