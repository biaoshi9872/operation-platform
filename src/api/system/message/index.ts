import { baseApi } from '@/base/baseApi'
import request from '@/utils/axios'
class messageApi extends baseApi {
  /**
   * 解密
   * @param data
   * @returns
   */
  A_decryptResultData(data: any) {
    return request({
      url: '/api/page/decryptResultData',
      method: 'POST',
      data
    })
  }
}

export default new messageApi()
