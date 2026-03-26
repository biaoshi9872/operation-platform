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

  /**
   * 导出
   * @param data
   * @returns
   */
  A_orderExport(data: any) {
    return request<any>({
      url: '/export/order/export',
      method: 'post',
      data: data
    })
  }

  /**
   * 商品订单 - 发货商品明细
   */
  A_deliverOrder(data: API.T_ShangPinDingDanFaHuoShangPinMingXiRequest) {
    return request<API.T_ShangPinDingDanFaHuoShangPinMingXiResponses>({
      url: '/order/deliver/goods/detail',
      method: 'get',
      params: data
    })
  }

  /**
   * 商品订单 - 发货
   */
  A_deliverOrderSave(data: any) {
    return request<any>({
      url: '/order/deliver/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 商品订单 - 批量发货
   */
  A_deliverImport(data: any) {
    return request<API.T_ShangPinDingDanPiLiangFaHuoResponses>({
      url: '/order/deliver/import',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data: data
    })
  }

  /**
   * 商品订单 - 下载发货失败数据
   */
  A_deliverFailData(data: any) {
    return request<any>({
      url: '/order/deliver/download/failData',
      method: 'post',
      responseType: 'blob',
      requestOptions: {
        noCheck: true
      },
      data: data
    })
  }

  /**
   * 待发货数量
   */
  A_waitDeliverCount() {
    return request({
      url: '/order/waitDeliverCount',
      method: 'post',
      data: {}
    })
  }

  A_receiveCoupon = (data: Object) => {
    return request({
      url: '/inner/coupon/receiveCoupon',
      method: 'post',
      data: {
        retry: true,
        ...data
      }
    })
  }

  /**
   * 失败记录
   */
  A_queryFailLog(orderId: string) {
    return request<any>({
      url: `order/queryFailLog/${orderId}`,
      method: 'post'
    })
  }

  /**
   * 重试
   */
  A_retry(data: { orderId: string; accountNumber: string }) {
    return request<any>({
      url: `order/retry`,
      method: 'post',
      params: data
    })
  }

  /**
   * 补发记录
   */
  A_queryPartLog(orderNo: string) {
    return request<any>({
      url: `/order/reissueLog`,
      method: 'post',
      params: {
        orderNo
      }
    })
  }

  /**
   * 补发
   */
  A_reissue(data: { orderId: string; accountNumber: string }) {
    return request<any>({
      url: `/order/reissue`,
      method: 'post',
      params: data
    })
  }
}

export default new order_api()
