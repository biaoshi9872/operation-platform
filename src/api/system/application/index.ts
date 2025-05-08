import request from '@/utils/axios'
class application_api {
  /**
   * 应用新增(编辑)
   */
  A_save(data: API.T_YingYongXinZengBianJiRequest) {
    return request<any>({
      url: '/sys/application/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 应用列表
   */
  A_list(data: API.T_YingYongLieBiaoSearchForm) {
    return request<API.T_YingYongLieBiaoListRecords[]>({
      url: '/sys/application/list',
      method: 'post',
      data: data
    })
  }

  /**
   * 分页查询
   */
  A_page(data: API.T_FenYeChaXunSearchForm) {
    return request<API.T_FenYeChaXunListRecords[]>({
      url: '/sys/application/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 启用禁用状态
   */
  A_status(data: any) {
    return request<any>({
      url: '/sys/application/status',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data: data
    })
  }
}

export default new application_api()
