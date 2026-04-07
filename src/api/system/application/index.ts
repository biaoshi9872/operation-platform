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
   * 应用价格预警分页列表
   */
  A_pagePriceAlarm(data: API.T_YingYongJiaGeYuJingFenYeSearchForm) {
    return request<API.T_YingYongJiaGeYuJingFenYeListRecords[]>({
      url: '/sys/application/pagePriceAlarm',
      method: 'post',
      data: data
    })
  }

  /**
   * 更新应用价格风控开关
   */
  A_updatePriceAlarm(data: API.T_GengXinYingYongJiaGeFengKongKaiGuanRequest) {
    return request<any>({
      url: '/sys/application/updatePriceAlarm',
      method: 'post',
      data: data
    })
  }

  /**
   * 查询价格预警变更记录
   */
  A_priceAlarmLog(data: API.T_JiaGeYuJingBianGengJiLuSearchForm) {
    return request<API.T_JiaGeYuJingBianGengJiLuListRecords[]>({
      url: '/sys/application/priceAlarmLog',
      method: 'get',
      params: data
    })
  }

  /**
   * 导出
   */
  A_pagePriceAlarmExport(data: API.T_YingYongJiaGeYuJingFenYeSearchForm) {
    return request<any>({
      url: '/sys/application/pagePriceAlarmExport',
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

  /**
   * 详情
   *
   */
  A_applicationDetail(data: any) {
    return request<any>({
      url: '/sys/application/detail',
      method: 'get',
      params: data
    })
  }

  /**
   * 获取银行信息
   */

  A_getZjnxBankMap() {
    return request<any>({
      url: '/goods/api/getZjnxBankMap',
      method: 'post'
    })
  }
}

export default new application_api()
