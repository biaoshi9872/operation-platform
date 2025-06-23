declare namespace API {
  //查询条件对接
  type MerchantPrepaidParams = {
    merchantCode: array[String]
    merchantName: array[String]
    prepaidDepositLimitFlag: string
  }
  //单条记录
  type MerchantPrepaidRecording = {
    merchantId: String
    merchantCode: String
    merchantName: String
    amountRechargeTotal: Number
    amountUsedTotal: Number
    amountBalance: Number
    amountCreditLine: Number
  }
  type MerchantPrepaidList = MerchantPrepaidRecording[]

  //预充值
  type TFromInstance = {
    merchantId: Number | null
    merchantCode: String
    businessType: Number | null
    amount: Number | null
    images: String
    remark: String
  }

  //查询条件对接
  type ConsumptionHistoryParams = {
    merchantId: String[]
    merchantCode?: String[]
    merchantName: String[]
    actionType: String[]
    startTime: String | null
    endTime: String | null
    plantOrderNo: String | null
  }
  //单条记录
  type ConsumptionHistoryRecording = {
    id: Number
    merchantId: Number
    merchantCode: String
    merchantName: String
    actionType: Number
    amount: Number
    amountBalance: Number
    amountCreditLine: Number
    amountCreditLineUsed: Number
    amountCreditLineBalance: Number
    plantOrderNo: String
    remark: String
    createDate: String
  }
  type ConsumptionHistoryList = ConsumptionHistoryRecording[]

  //查询条件对接
  type applyForATopUpRecordParams = {
    merchantId?: any[]
    merchantCode?: any[]
    merchantName?: any[]
    operationStatus: any
    rechargeStartTime: String
    rechargeEndTime: String
    rechargeNo: String
  }
  //单条记录
  type applyForATopUpRecordRecording = {
    id: Number
    rechargeNo: String
    merchantId: Number
    merchantCode: String
    amount: Number
    images: String
    operationStatus: Number
    createUserId: Number
    createUserName: String
    createDate: String
  }
  type applyForATopUpRecordList = applyForATopUpRecordRecording[]
}
