import { baseApi } from '@/base/baseApi'
import request from '@/utils/axios'
class messageApi extends baseApi {
  /**
   *
   * @returns 列表
   */
  A_getList(data: any) {
    return request({
      url: '/visual/page',
      method: 'POST',
      data
    })
  }

  /**
   *
   * @returns 主题
   */
  A_topicList() {
    return request({
      url: '/visual/topicList',
      method: 'get'
    })
  }

  /**
   * 解密
   * @param data
   * @returns
   */
  A_decryptResultData(data: any) {
    return request({
      url: '/api-v2/api/page/decryptResultData',
      method: 'POST',
      data
    })
  }
}

export default new messageApi()
