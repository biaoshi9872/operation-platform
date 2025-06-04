declare namespace API {
  /**
   * 售后列表Request
   */
  type T_ShouHouLieBiaoRequest = {
    /**
     * 应用
     */
    appId: number
    /**
     * 售后类型
     */
    afterSaleTypeList: any[]

    /**
     * 售后单状态
     */
    statusList: any[]

    /**
     * 申请时间起
     */
    applyTimeStart: string
    /**
     * 申请时间止
     */
    applyTimeEnd: string
    /**
     * 渠道订单号
     */
    channelOrderNo: string
    /**
     * 渠道售后单号
     */
    channelAfterSaleNo: string
    /**
     * 商品名称
     */
    skuName: string
    /**
     * 商品编码
     */
    skuCode: string
    /**
     * 供应商
     */
    supplierIdList: any[]

    /**
     * 是否脱敏
     */
    desensitizationStatus: number
    /**
     *
     */
    offset: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 售后列表Responses
   */
  type T_ShouHouLieBiaoResponses = {
    /**
     * 主键
     */
    id: number
    /**
     * 开发平台售后单号
     */
    afterSaleNo: string
    /**
     * 开放平台订单号
     */
    orderNo: string
    /**
     * 渠道订单号
     */
    channelOrderNo: string
    /**
     * 渠道售后单号
     */
    channelAfterSaleNo: string
    /**
     * 第三方售后单号
     */
    thirdAfterSaleNo: string
    /**
     * 售后类型
     */
    afterSaleType: number
    /**
     * 渠道来源
     */
    channelSource: number
    /**
     * 申请时间
     */
    applyTime: string
    /**
     * 供应商名称
     */
    supplyName: string
    /**
     * 是否脱敏
     */
    desensitizationStatus: number
    /**
     * 售后单状态
     */
    status: number
    /**
     * 商品编码
     */
    skuCode: string
    /**
     * 商品名称
     */
    skuName: string
    /**
     * 售后数量
     */
    afterSaleNum: number
    /**
     * 商品图片
     */
    images: string
    /**
     * 计量单位
     */
    unit: string
    /**
     * 平台成本
     */
    platformPurchasePrice: number
    /**
     * 平台供应价
     */
    platformSupplyPrice: number
    /**
     * 平台分销价
     */
    retailPrice: number
    /**
     * 应用名称
     */
    appName: number
    /**
     * 机构名称
     */
    orgName: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 售后详情Request
   */
  type T_ShouHouXiangQingRequest = {
    /**
     * 开放平台售后单号
     */
    afterSaleNo: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 售后详情Responses
   */
  type T_ShouHouXiangQingResponses = {
    /**
     * 机构
     */
    orgId: number
    /**
     * 应用
     */
    appId: number
    /**
     * 开发平台售后单号
     */
    afterSaleNo: string
    /**
     * 开放平台订单号
     */
    orderNo: string
    /**
     * 渠道订单号
     */
    channelOrderNo: string
    /**
     * 渠道售后单号
     */
    channelAfterSaleNo: string
    /**
     * 第三方售后单号
     */
    thirdAfterSaleNo: string
    /**
     * 申请时间
     */
    applyTime: string
    /**
     * 供应商名称
     */
    supplyName: string
    /**
     * 售后单状态
     */
    status: number
    /**
     * 申请人
     */
    applyUserName: string
    /**
     * 申请人手机号
     */
    applyUserMobile: string
    /**
     * 售后类型
     */
    afterSaleType: number
    /**
     * 售后原因
     */
    reasonCode: number
    /**
     * 售后原因
     */
    reasonName: string
    /**
     * 售后说明
     */
    reasonDescription: string
    /**
     * 售后图片
     */
    images: string
    /**
     * 拒绝原因
     */
    rejectReason: string
    /**
     * 取消原因
     */
    cancelReason: string
    /**
     * 客服意见
     */
    serviceRemark: string
    /**
     *
     */
    afterSaleGoodsVO: {
      /**
       *
       */
      afterSaleNo: string
      /**
       * 商品编码
       */
      skuCode: string
      /**
       * 商品名称
       */
      skuName: string
      /**
       * 规格
       */
      spec: string
      /**
       * 商品图片
       */
      images: string
      /**
       * 售后数量
       */
      afterSaleNum: number
      /**
       * 商品数量
       */
      totalNum: number
      /**
       * 平台成本
       */
      platformPurchasePrice: number
      /**
       * 平台供应价
       */
      platformSupplyPrice: number
      /**
       * 平台分销价
       */
      retailPrice: number
      /**
       * 售后成本
       */
      afterSalePurchasePrice: number
      /**
       * 售后供应价
       */
      afterSaleSupplyPrice: number
      /**
       * 售后分销价
       */
      afterSaleRetailPrice: number
      /**
       * 运费
       */
      freightAmount: number
      /**
       * 进项税率
       */
      tax: number
      /**
       * 进项发票类型
       */
      invoiceType: number

      /**
       *  扩展属性
       */
      [T: string]: any
    }

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 售后单进度Request
   */
  type T_ShouHouDanJinDuRequest = {
    /**
     * 开发平台售后单号
     */
    afterSaleNo: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 售后单进度Responses
   */
  type T_ShouHouDanJinDuResponses = {
    /**
     * 节点名称
     */
    flowNodeName: string
    /**
     * 操作时间
     */
    operationTime: string
    /**
     * 节点标记
     */
    completeFlag: any

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 售后审核Request
   */
  type T_ShouHouShenHeRequest = {
    /**
     * 开发平台售后单号
     */
    afterSaleNo: string
    /**
     * 审核状态
     */
    auditStatus: number
    /**
     * 处理意见
     */
    rejectReason: string
    /**
     * 客服备注
     */
    serviceRemark: string
    /**
     * 退给客户的金额
     */
    refundCustomerPrice: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 售后撤销Request
   */
  type T_ShouHouCheXiaoRequest = {
    /**
     * 开发平台售后单号
     */
    afterSaleNo: string
    /**
     * 客服备注
     */
    serviceRemark: string
    /**
     * 处理意见
     */
    cancelReason: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 查询售后金额Request
   */
  type T_ChaXunShouHouJinERequest = {
    /**
     * 开发平台售后单号
     */
    afterSaleNo: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 查询售后金额Responses
   */
  type T_ChaXunShouHouJinEResponses = {
    /**
     * 运费
     */
    freightAmount: string
    /**
     * 预退分销价
     */
    preRetailPrice: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 后台申请售后Request
   */
  type T_HouTaiShenQingShouHouRequest = {
    /**
     * 机构
     */
    orgId: number
    /**
     * 应用
     */
    appId: number
    /**
     * 渠道订单号
     */
    channelOrderNo: string
    /**
     * 售后编码
     */
    reasonCode: number
    /**
     * 售后原因
     */
    reasonName: string
    /**
     * 售后图片
     */
    reasonImages: string
    /**
     * 售后说明
     */
    reasonDescription: string
    /**
     *
     */
    afterSaleGoodsList: {
      /**
       * 商品编码
       */
      skuCode?: string
      /**
       * 售后数量
       */
      afterSaleNum?: number

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     * 第三方售后单号
     */
    thirdAfterSaleNo: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 后台申请售后Responses
   */
  type T_HouTaiShenQingShouHouResponses = {
    /**
     * 第三方售后单号
     */
    thirdAfterSaleNo: string
    /**
     * 开发平台售后单号
     */
    afterSaleNoList: any[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
