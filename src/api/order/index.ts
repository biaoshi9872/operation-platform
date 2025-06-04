import request from '@/utils/axios'

class order_api {
  /**
   * 订单分页接口
   */
  A_page(data: API.T_DingDanFenYeJieKouSearchForm) {
    return request<API.T_DingDanFenYeJieKouListRecords[]>({
      url: 'order/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 详情
   */
  A_getDetail(data: any) {
    return request<API.T_XiangQingResponses>({
      url: `/order/detail`,
      method: 'post',
      requestOptions: {
        formData: true
      },
      data: data
    })
  }

  /**
   * 订单进度流程图
   */
  A_getOrderProcess(data: any) {
    return request<API.T_DingDanJinDuLiuChengTuListRecords[]>({
      url: `/order/orderProcess`,
      requestOptions: {
        formData: true
      },
      data: data,
      method: 'post'
    })
  }

  /**
   * 订单导出
   * @param data
   * @returns
   */
  A_orderExport(data: any) {
    return request<API.T_DingDanFenYeJieKouListRecords[]>({
      url: '/order/page',
      method: 'post',
      data: data
    })
  }
  /**
   * 物流轨迹
   * @param data
   * @returns
   */
  A_orderQueryTrace(data: any) {
    return request<any>({
      url: '/order/queryTrace',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data: data
    })
  }
}

export default new order_api()
