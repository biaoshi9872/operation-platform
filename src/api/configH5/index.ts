import request from '@/utils/axios'

class configH5_api {
  /**
   *
   * @param {分页查询} data
   * @returns
   */
  A_getSysConfigList(data: any) {
    return request({
      url: '/h5/system/config/queryPage',
      method: 'post',
      data,
      requestOptions: {
        formData: true
      }
    })
  }

  /**
   * 设置系统配置
   * @param data
   * @returns
   */
  A_editSysConfig(data: any) {
    let api = data.id ? '/h5/system/config/updateSysConfig' : '/h5/system/config/addSysConfig'
    return request({
      url: api,
      method: 'post',
      data,
      requestOptions: {
        formData: true
      }
    })
  }

  /**
   * 刷新缓存
   * @param data
   * @returns
   */
  A_refreshAllRedisCache(data: any) {
    return request({
      url: '/h5/system/config/refreshAllRedisCache',
      method: 'post',
      data
    })
  }

  /**
   * 所有缓存
   * @param data
   * @returns
   */
  A_getValueFromCache(params: any) {
    return request({
      url: '/h5/system/config/getAllSystemConfigFromRedisCache',
      method: 'get',
      params
    })
  }
}

export default new configH5_api()
