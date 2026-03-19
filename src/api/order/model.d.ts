declare namespace API {
  /**
   * 商品订单 - 发货商品明细Request
   */
  type T_ShangPinDingDanFaHuoShangPinMingXiRequest = {
    /**
     *
     */
    channelOrderNo?: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 商品订单 - 发货商品明细Responses
   */
  type T_ShangPinDingDanFaHuoShangPinMingXiResponses = {
    /**
     *
     */
    provinceId: string
    /**
     *
     */
    cityId: string
    /**
     *
     */
    countyId: string
    /**
     *
     */
    townId: string
    /**
     *
     */
    address: string
    /**
     *
     */
    receiverPhone: string
    /**
     *
     */
    receiverName: string
    /**
     *
     */
    goodsVOList: {
      /**
       *
       */
      skuName: string
      /**
       *
       */
      skuCode: string
      /**
       *
       */
      images: string
      /**
       *
       */
      deliverNum: number
      /**
       *
       */
      outgoingStatus: any

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 商品订单 - 批量发货Responses
   */
  type T_ShangPinDingDanPiLiangFaHuoResponses = {
    /**
     * 总数量
     */
    totalNum: string
    /**
     * 成功数量
     */
    successNum: string
    /**
     * 失败数量
     */
    failNum: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }
  /**
   * 订单分页接口查找
   */
  type T_DingDanFenYeJieKouSearchForm = {
    /**
     *
     */
    skuCode: string
    /**
     * 应用进入应用的时候要传
     */
    appId: any
    /**
     * 订单提交时间
     */
    submitTimeStart: string
    /**
     *
     */
    submitTimeEnd: string
    /**
     * 订单确认时间
     */
    confirmTimeStart: string
    /**
     *
     */
    confirmTimeEnd: string
    /**
     * 开放平台订单号
     */
    orderNo: string
    /**
     * 渠道订单号
     */
    channelOrderNo: string
    /**
     * 供应商
     */
    supplyId: string
    /**
     * 商品名称
     */
    skuName: string
    /**
     * 收货人
     */
    receiverName: string
    /**
     * 收货人手机号
     */
    receiverPhone: string
    /**
     *
     */
    channelSource: string
    /**
     * 面单是否脱敏
     */
    desensitizationStatus: string
    /**
     * 批次号
     */
    thirdBatchNo: string
    /**
     * 券id
     */
    thirdCouponId: string
    /**
     * 立减金平台 1微信 2支付宝
     */
    couponPlatform: number | string
    /**
     * 领取账号
     */
    accountNumber: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 订单分页接口列表
   */
  type T_DingDanFenYeJieKouListRecords = {
    /**
     *
     */
    id?: number
    /**
     * 面单是否脱敏
     */
    desensitizationStatus?: number
    /**
     * 开放平台订单号
     */
    orderNo?: string
    /**
     * 渠道订单号
     */
    channelOrderNo?: string
    /**
     * 订单提交时间
     */
    submitTime?: string
    /**
     * 订单确认时间
     */
    confirmTime?: string
    /**
     * 供应商
     */
    supplyId?: number
    /**
     * 供应商名称
     */
    supplyName?: string
    /**
     * 商品总金额分销价
     */
    retailPriceTotal?: number
    /**
     * 订单运费
     */
    freightAmount?: number
    /**
     * 订单总金额分销价商品数量运费
     */
    totalAmount?: number
    /**
     * 收货人
     */
    receiverName?: string
    /**
     *
     */
    channelSource?: number
    /**
     * 商品列表
     */
    goodsList?: {
      /**
       * 商品编码
       */
      skuCode: string
      /**
       * 商品名称
       */
      skuName: string
      /**
       * 属性
       */
      attributeValue1: string
      /**
       * 属性
       */
      attributeValue2: any
      /**
       * 商品图片
       */
      images: string
      /**
       * 下单数量
       */
      goodsNum: number
      /**
       * 平台成本链供应价
       */
      platformPurchasePrice: number
      /**
       * 平台供应价机构加价之后
       */
      platformSupplyPrice: number
      /**
       * 零售价应用的分销价
       */
      retailPrice: number
      /**
       * 单位
       */
      unit: string
      /**
       *
       */
      afterSaleStatus: any

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 详情Responses
   */
  type T_XiangQingResponses = {
    /**
     * 买家备注
     */
    remark: string
    /**
     * 订单运费
     */
    freightAmount: number
    /**
     * 订单基础信息
     */
    orderBaseInfo: {
      /**
       *
       */
      orderStatus: number
      /**
       * 渠道订单号
       */
      channelOrderNo: string
      /**
       * 订单提交时间
       */
      submitTime: string
      /**
       * 订单确认时间
       */
      confirmTime: string
      /**
       * 下单人
       */
      buyer: string
      /**
       * 下单人手机号
       */
      buyerPhone: string

      /**
       *  扩展属性
       */
      [T: string]: any
    }

    /**
     * 收货信息
     */
    receiverInfo: {
      /**
       * 收货人
       */
      receiverName: string
      /**
       * 收货人手机号
       */
      receiverPhone: string
      /**
       * 详细地址
       */
      address: string

      /**
       *  扩展属性
       */
      [T: string]: any
    }

    /**
     * 商品信息财务信息
     */
    goodsInfo: {
      /**
       *
       */
      skuCode: string
      /**
       * 商品名称
       */
      skuName: string
      /**
       * 属性
       */
      attributeValue1: string
      /**
       * 属性
       */
      attributeValue2: any
      /**
       * 图片
       */
      images: string
      /**
       * 平台成本链供应价
       */
      platformPurchasePrice: number
      /**
       * 平台供应价机构加价之后
       */
      platformSupplyPrice: number
      /**
       * 零售价应用的分销价
       */
      retailPrice: number
      /**
       * 下单数量
       */
      goodsNum: number
      /**
       * 小计分销价数量
       */
      subTotal: number
      /**
       *
       */
      afterSaleStatus: any
      /**
       * 进项税率
       */
      tax: number
      /**
       *
       */
      invoiceType: number

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 订单进度流程图列表
   */
  type T_DingDanJinDuLiuChengTuListRecords = {
    /**
     *
     */
    flowNodeName: string
    /**
     *
     */
    operationTime: string
    /**
     *
     */
    remark: any
    /**
     *
     */
    completeFlag: any

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  type OrderListParams = T_DingDanFenYeJieKouSearchForm

  type OrderListRowInfo = T_DingDanFenYeJieKouListRecords
}
