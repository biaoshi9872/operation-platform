import request from '@/utils/axios'
class apiLinkProduct_api {
  /**
   * API商品关联 新增
   */
  A_save(data: API.T_APIShangPinGuanLianXinZengRequest) {
    return request<API.T_APIShangPinGuanLianXinZengResponses>({
      url: '/goods/api/save',
      method: 'post',
      data: data
    })
  }

  /**
   * API商品关联 修改
   */
  A_update(data: API.T_APIShangPinGuanLianXiuGaiRequest) {
    return request<API.T_APIShangPinGuanLianXiuGaiResponses>({
      url: '/goods/api/update',
      method: 'post',
      data: data
    })
  }

  /**
   * API商品关联 分页
   */
  A_page(data: API.T_APIShangPinGuanLianFenYeSearchForm) {
    return request<API.T_APIShangPinGuanLianFenYeResponses>({
      url: '/goods/api/page',
      method: 'post',
      data: data
    })
  }

  /**
   * API商品关联 导出
   */
  A_goodExport(data: API.T_APIShangPinGuanLianFenYeSearchForm) {
    return request({
      url: '/export/goods/apiRel',
      method: 'post',
      data: data
    })
  }

  /**
   * 订单重试
   */
  A_retrySubmit(data: API.T_DingDanChongShiRequest) {
    return request<API.T_DingDanChongShiResponses>({
      url: '/order/retry/submit',
      method: 'post',
      data: data
    })
  }

  /**
   * 异常订单列表
   */
  A_retryPage(data: API.T_YiChangDingDanLieBiaoSearchForm) {
    return request<API.T_YiChangDingDanLieBiaoResponses>({
      url: '/order/retry/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 异常订单列表 导出
   */
  A_exportException(data: API.T_YiChangDingDanLieBiaoDaoChuRequest) {
    return request<API.T_YiChangDingDanLieBiaoDaoChuResponses>({
      url: '/export/order/api/exception',
      method: 'post',
      data: data
    })
  }

  /**
   * 查看异常订单商品详情
   */
  A_getExceptionOrderProductDetail(data: any) {
    return request({
      url: '/order/retry/goodsDetail',
      method: 'get',
      params: data
    })
  }
}

export default new apiLinkProduct_api()
