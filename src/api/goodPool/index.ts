import request from '@/utils/axios'
class goodPool_api {
  /**
   * API商品池分页查询
   */
  A_apiGoodsPoolPage(data: API.T_ShangPinChiFenYeChaXunSearchForm) {
    return request<API.T_ShangPinChiFenYeChaXunListRecords[]>({
      url: '/productPool/apiGoodsPoolPage',
      method: 'post',
      data: data
    })
  }

  /**
   * API商品池加入商品池
   */
  A_add(data: API.T_ShangPinChiJiaRuShangPinChiRequest) {
    return request<any>({
      url: '/myGoodsPool/add',
      method: 'post',
      data: data
    })
  }

  /**
   * API商品池/我的商品池详情查询
   */
  A_details(data: API.T_ShangPinChiWoDeShangPinChiXiangQingChaXunRequest) {
    return request<any>({
      url: '/myGoodsPool/details',
      method: 'post',
      data: data
    })
  }

  /**
   * 商品池导出
   */
  A_goodsPoolExport(data: any) {
    return request<any>({
      url: '/export/goods/goodsPoolExport',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池分页查询
   */
  A_myGoodsPoolPage(data: any) {
    return request<any>({
      url: '/myGoodsPool/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-批量改价
   */
  A_batchUpdatePrice(data: any) {
    return request<any>({
      url: '/myGoodsPool/batchUpdatePrice',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-单个改价
   */
  A_updatePrice(data: any) {
    return request<any>({
      url: '/myGoodsPool/updatePrice',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-批量移除（含单个移除）
   */
  A_batchDelete(data: any) {
    return request<any>({
      url: '/myGoodsPool/batchDelete',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-批量上下架（含单个）
   */
  A_batchUpdateStatus(data: any) {
    return request<any>({
      url: '/myGoodsPool/batchUpdateStatus',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-导出
   */
  A_myGoodsPoolExport(data: any) {
    return request<any>({
      url: '/export/goods/myGoodsPoolExport',
      method: 'post',
      data: data
    })
  }
}
export default new goodPool_api()
