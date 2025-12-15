import isStateCheckHooks from '@/hooks/isStateCheckHooks'
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
   * 售后单物流信息
   */
  A_queryTrackInfo(data: any) {
    return request<any>({
      url: '/afterSale/queryTrackInfo',
      method: 'post',
      data: data
    })
  }

  /**
   * 售后导出
   */
  A_AfterOrderExport(data: any) {
    const { getSystemOptionType } = isStateCheckHooks()
    console.log(getSystemOptionType.value, '111')
    let url = ''
    switch (getSystemOptionType.value) {
      case '10':
        url = '/export/afterSale/afterSaleTopAppExport'
        break
      case '20':
        url = '/export/afterSale/afterSaleBranchAppExport'
        break
      case '101':
        url = '/export/afterSale/afterSaleTopOrgExport'
        break
      case '201':
        url = '/export/afterSale/afterSaleBranchOrgExport'
        break
      case '401':
        url = '/export/afterSale/supplyExport'
        break
    }
    return request<any>({
      url: url,
      method: 'post',
      data: data
    })
  }

  /**
   * 预售后订单详情
   */
  A_preAfterOrderDetail(data: any) {
    return request<any>({
      url: '/afterSale/orderDetail',
      method: 'post',
      data: data
    })
  }

  /**
   * 售后审核
   */
  A_auditEC(data: API.T_ShouHouShenHeRequest) {
    return request<any>({
      url: '/afterSale/auditEC',
      method: 'post',
      data: data
    })
  }

  /**
   * 申请理赔退款补偿
   */
  A_applyRefundCompensate(data: { channelOrderNo: string; skuCode: string; type: number }) {
    return request<any>({
      url: '/afterSale/applyRefundCompensate',
      method: 'post',
      data: data
    })
  }

  /**
   * 新天猫售后预渲染
   */
  A_afterSaleRender(data: { channelOrderNo: string; skuCode: string; type: number }) {
    return request<any>({
      url: '/afterSale/afterSaleRender',
      method: 'post',
      data: data
    })
  }

  /**
   * 理赔确认已到账
   */
  A_refundCompensateConfirm(data: any) {
    return request<any>({
      url: '/afterSale/refundCompensateConfirm',
      method: 'post',
      data: data
    })
  }

  /**
   * 理赔节点
   */
  A_compensatePsrogress(data: any) {
    return request<any>({
      url: '/afterSale/compensate/progress',
      method: 'post',
      data: data
    })
  }
}

export default new After_order_api()
