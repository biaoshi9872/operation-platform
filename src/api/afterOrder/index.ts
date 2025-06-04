import request from '@/utils/axios'
class After_order_api {
  /**
   * 售后列表
   */
  A_queryPage(data: API.T_ShouHouLieBiaoRequest) {
    return request<API.T_ShouHouLieBiaoResponses>({
      url: '/afterSale/queryPage',
      method: 'post',
      data: data
    })
  }

  /**
   * 售后详情
   */
  A_detail(data: API.T_ShouHouXiangQingRequest) {
    return request<API.T_ShouHouXiangQingResponses>({
      url: '/afterSale/detail',
      method: 'post',
      data: data
    })
  }

  /**
   * 售后单进度
   */
  A_progress(data: API.T_ShouHouDanJinDuRequest) {
    return request<API.T_ShouHouDanJinDuResponses>({
      url: '/afterSale/progress',
      method: 'post',
      data: data
    })
  }

  /**
   * 售后审核
   */
  A_audit(data: API.T_ShouHouShenHeRequest) {
    return request<any>({
      url: '/afterSale/audit',
      method: 'post',
      data: data
    })
  }

  /**
   * 售后撤销
   */
  A_cancel(data: API.T_ShouHouCheXiaoRequest) {
    return request<any>({
      url: '/afterSale/cancel',
      method: 'post',
      data: data
    })
  }

  /**
   * 查询售后金额
   */
  A_findAfterSalePrice(data: API.T_ChaXunShouHouJinERequest) {
    return request<API.T_ChaXunShouHouJinEResponses>({
      url: '/afterSale/findAfterSalePrice',
      method: 'post',
      data: data
    })
  }

  /**
   * 后台申请售后
   */
  A_backApply(data: API.T_HouTaiShenQingShouHouRequest) {
    return request<API.T_HouTaiShenQingShouHouResponses>({
      url: '/afterSale/backApply',
      method: 'post',
      data: data
    })
  }

  /**
   * 售后单导出
   */
  A_queryTrackInfo(data: any) {
    return request<any>({
      url: '/afterSale/queryTrackInfo',
      method: 'post',
      data: data
    })
  }
}

export default new After_order_api()
