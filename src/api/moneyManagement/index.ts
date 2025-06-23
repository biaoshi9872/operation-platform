import request from '@/utils/axios'
// 分销商管理>财务充值

class moneyManagement_api {
  A_queryMerchantPrepaidDepositList(data: API.MerchantPrepaidParams) {
    return request<API.MerchantPrepaidRecording>({
      url: '/merchant/prepaidDeposit/queryMerchantPrepaidDepositList',
      method: 'post',
      data
    })
  }

  //导出
  A_merchantPrepaidDepositExport(data: API.MerchantPrepaidParams) {
    return request<API.MerchantPrepaidRecording>({
      url: '/merchant/prepaidDeposit/exportMerchantPrepaidDepositList',
      method: 'post',
      // requestOptions: {
      //   noCheck: true,
      // },
      // responseType: 'blob',
      data
    })
  }

  //预充值保存
  A_saveRecharge(data: API.TFromInstance) {
    return request({
      url: '/merchant/prepaidDeposit/operation/recharge',
      method: 'post',
      data
    })
  }

  //存款充值记录列表
  A_queryPrepaidDepositRechargeLog(data: any) {
    return request({
      url: '/merchant/prepaidDepositRechargeLog/operation/queryPrepaidDepositRechargeLog',
      method: 'post',
      data
    })
  }

  //消费记录查询
  A_queryPrepaidDepositLog(data: API.ConsumptionHistoryParams) {
    return request<API.ConsumptionHistoryList>({
      url: '/merchant/prepaidDepositLog/operation/queryPrepaidDepositLog',
      method: 'post',
      data
    })
  }

  //消费记录导出
  A_exportRepaidDepositLog(data: API.ConsumptionHistoryParams) {
    return request({
      url: '/download/center/prepaidDepositLogExport',
      method: 'post',
      data
    })
  }

  //查询申请充值记录列表
  A_queryPrepaidDepositRechargeApply(data: any) {
    return request({
      url: '/merchant/prepaidDepositRechargeApply/operation/queryPrepaidDepositRechargeApply',
      method: 'post',
      data
    })
  }

  //查询申请充值记录导出
  A_exportPrepaidDepositRechargeApply(data: any) {
    return request({
      url: '/download/center/prepaidDepositRechargeApplyExport',
      method: 'post',
      data
    })
  }

  //确定已处理
  A_processPrepaidDepositRechargeApply(data: { rechargeNo: String }) {
    return request({
      url: '/merchant/prepaidDepositRechargeApply/operation/processPrepaidDepositRechargeApply',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data
    })
  }

  // 分销商_查询增加的预存款
  A_queryIncrement(params: any) {
    return request({
      url: '/merchant/prepaidDeposit/queryIncrement',
      method: 'get',
      params
    })
  }

  // 分销商_查询减少的预存款
  A_queryDecrement(params: any) {
    return request({
      url: '/merchant/prepaidDeposit/queryDecrement',
      method: 'get',
      params
    })
  }

  //分销商预存信息
  A_queryByMerchantId(params: any) {
    return request({
      url: '/merchant/prepaidDeposit/queryByMerchantId',
      method: 'get',
      params
    })
  }

  //申请充值
  A_prepaidDepositRechargeApply(data: any) {
    return request({
      url: '/merchant/prepaidDepositRechargeApply/merchant/prepaidDepositRechargeApply',
      method: 'post',
      data
    })
  }

  //分销商_修改预存款预备警配置
  A_updatePrepaidDepositRechargeWarnConfig(data: any) {
    return request({
      url: '/merchant/prepaidDeposit/merchant/updatePrepaidDepositRechargeWarnConfig',
      method: 'post',
      data
    })
  }
}

export default new moneyManagement_api()
