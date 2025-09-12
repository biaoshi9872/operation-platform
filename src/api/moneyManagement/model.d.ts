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

  // 开放平台 - 账单列表 查询参数
  type OpenBillPageParams = {
    billDate: String
    billNO: String
    orgId: Number | null
    appId: Number | null
    page: Number
    limit: Number
  }

  // 开放平台 - 账单列表 单条记录
  type OpenBillPageRecord = {
    orgName: String
    appName: String
    billDate: String
    billNo: String
    goodsAmountTotal: Number
    goodsAmountAfterTotal: Number
    goodsAmountInvoiceTotal: Number
    goodsFreightTotal: Number
    goodsFreightAfterTotal: Number
    goodsFreightInvoiceTotal: Number
    goodsServiceTotal: Number
    goodsServiceAfterTotal: Number
    goodsServiceInvoiceTotal: Number
    goodsAmountFinalInvoiceTotal: Number
  }

  // 开放平台 - 账单列表 分页体
  type OpenBillPage = {
    records: OpenBillPageRecord[]
    pageNumber: Number
    pageSize: Number
    totalPage: Number
    totalRow: Number
  }

  // 开放平台 - 账单列表 响应体
  type OpenBillPageResponse = {
    msg: String
    code: Number
    page: OpenBillPage
  }

  // 开放平台 - 账单列表导出 参数（与列表相同）
  type OpenExportBillParams = OpenBillPageParams

  // 开放平台 - 账单明细 查询参数
  type OpenBillDetailParams = {
    billNo: String
    orderNo: String
    channelOrderNo: String
    outOrderNo: String
    skuName: String
    goodsType: Number | null
    submitTimeStart: String
    submitTimeEnd: String
    confirmTimeStart: String
    confirmTimeEnd: String
  }

  // 开放平台 - 账单明细 单条记录
  type OpenBillDetailRecord = {
    id: Number
    billNo: String
    orderNo: String
    channelOrderNo: String
    outOrderNo: String
    submitTime: String
    confirmTime: String
    skuCode: String
    skuName: String
    goodsType: Number
    goodsTypeName: String
    goodsNum: Number
    supplyId: Number
    supplyName: String
    retailPrice: Number
    goodsPriceTotal: Number
    freightAmount: Number
    serviceAmount: Number | null
    settlementPriceTotal: Number | null
    afterStatus: Number
    afterOrderType: Number | null
    orderStatus: Number
  }

  // 开放平台 - 账单明细 分页体
  type OpenBillDetail = {
    records: OpenBillDetailRecord[]
    pageNumber: Number
    pageSize: Number
    totalPage: Number
    totalRow: Number
  }

  // 开放平台 - 账单明细 响应体
  type OpenBillDetailResponse = {
    msg: String
    code: Number
    page: OpenBillDetail
  }

  // 开放平台 - 账单明细导出 参数（注意：billNO 为大写 O）
  type OpenBillDetailExportParams = {
    billNO: String
    page: Number
    limit: Number
  }
}
