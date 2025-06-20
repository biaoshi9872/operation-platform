declare namespace API {
  /**
   * 查询所有商品来源列表
   */
  type T_ChaXunSuoYouShangPinLaiYuanListRecords = {
    /**
     * 来源类行
     */
    id: number
    /**
     * 来源类型名称
     */
    sourceName: string
    /**
     * 创建时间
     */
    createDate: string
    /**
     * 更新时间
     */
    updateTime: any
    /**
     * 操作人
     */
    createBy: any
    /**
     * 图片
     */
    imageUrl: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 根据机构查询商品来源类型查找
   */
  type T_GenJuJiGouChaXunShangPinLaiYuanLeiXingSearchForm = {
    /**
     *
     */
    orgId?: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 根据机构查询商品来源类型列表
   */
  type T_GenJuJiGouChaXunShangPinLaiYuanLeiXingListRecords = {
    /**
     * 商品来源
     */
    id: number
    /**
     * 商品来源名称
     */
    sourceName: any
    /**
     * 创建时间
     */
    createDate: any
    /**
     * 修改时间
     */
    updateTime: any
    /**
     * 操作人
     */
    createBy: any

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * API商品池分页查询查找
   */
  type T_ShangPinChiFenYeChaXunSearchForm = {
    /**
     * 商品类型来源
     */
    productSource: number
    /**
     * 分销渠道
     */
    channelCode: string
    /**
     * 商品名称
     */
    skuName: string
    /**
     * 商品编码
     */
    skuCode: string
    /**
     * 一级分类
     */
    firstCateId: number
    /**
     * 二级分类
     */
    secondCateId: number
    /**
     * 三级分类
     */
    thirdCateId: number
    /**
     * 市场价最低
     */
    marketPriceMin: any
    /**
     * 市场价最高
     */
    marketPriceMax: any
    /**
     * 平台成本最低
     */
    platformCostMin: any
    /**
     * 平台成本最高
     */
    platformCostMax: any
    /**
     * 平台供应价最低
     */
    platformSupplyPriceMin: any
    /**
     * 平台供应价最高
     */
    platformSupplyPriceMax: any
    /**
     * 市场利润率最低
     */
    marketProfitRateMin: any
    /**
     * 市场利润率最高
     */
    marketProfitRateMax: any
    /**
     * 库存状态
     */
    stockStatus: number
    /**
     * 京东京东生鲜必传
     */
    provinceId: number
    /**
     * 京东京东生鲜必传
     */
    cityId: number
    /**
     * 必传
     */
    appId: any

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * API商品池分页查询列表
   */
  type T_ShangPinChiFenYeChaXunListRecords = {
    /**
     * 商品编码
     */
    skuCode: string
    /**
     * 商品名称
     */
    skuName: string
    /**
     * 商品分类
     */
    skuCategory: string
    /**
     * 商品封面图
     */
    skuImage: string
    /**
     * 市场价
     */
    markPrice: number
    /**
     * 平台成本
     */
    platformCost: number
    /**
     * 平台供应价
     */
    platformSupplyPrice: any
    /**
     * 销售单位
     */
    unit: string
    /**
     * 品牌
     */
    brandName: string
    /**
     * 市场价利润率
     */
    marketProfitMargin: any
    /**
     * 库存状态名称
     */
    stockStatusName: string
    /**
     * 库存状态
     */
    stockStatus: number
    /**
     * 规格
     */
    saleAttr: string
    /**
     * 创建时间
     */
    createDate: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * API商品池加入商品池Request
   */
  type T_ShangPinChiJiaRuShangPinChiRequest = {
    /**
     * 应用
     */
    appId: any
    /**
     * 商品来源类型
     */
    goodsSourceType: number
    /**
     * 价格类型
     */
    priceType: number
    /**
     * 加价类型
     */
    priceMarkupType: number
    /**
     * 加价策略
     */
    priceMarkupStrategy: number
    /**
     * 加价策略值
     */
    priceMarkupStrategyValue: any
    /**
     * 商品状态
     */
    goodsStatus: number
    /**
     * 编码集合
     */
    skuCodeList: any[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * API商品池/我的商品池详情查询Request
   */
  type T_ShangPinChiWoDeShangPinChiXiangQingChaXunRequest = {
    /**
     * 商品编号
     */
    skuCode: string
    /**
     * 商品来源
     */
    goodsSourceType: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 我的商品池分页查询查找
   */
  type T_WoDeShangPinChiFenYeChaXunSearchForm = {
    /**
     * 商品类型来源
     */
    productSource: number
    /**
     * 分销渠道
     */
    channelCode: string
    /**
     * 商品名称
     */
    skuName: string
    /**
     * 商品编码
     */
    skuCode: string
    /**
     * 一级分类
     */
    firstCateId: number
    /**
     * 二级分类
     */
    secondCateId: number
    /**
     * 三级分类
     */
    thirdCateId: number
    /**
     * 市场价最低
     */
    marketPriceMin: any
    /**
     * 市场价最高
     */
    marketPriceMax: any
    /**
     * 平台成本最低
     */
    platformCostMin: any
    /**
     * 平台成本最高
     */
    platformCostMax: any
    /**
     * 平台供应价最低
     */
    platformSupplyPriceMin: any
    /**
     * 平台供应价最高
     */
    platformSupplyPriceMax: any
    /**
     * 市场利润率最低
     */
    marketProfitRateMin: any
    /**
     * 市场利润率最高
     */
    marketProfitRateMax: any
    /**
     * 库存状态
     */
    stockStatus: number
    /**
     * 京东京东生鲜必传
     */
    provinceId: number
    /**
     * 京东京东生鲜必传
     */
    cityId: number
    /**
     * 必传
     */
    appId: any

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 我的商品池分页查询列表
   */
  type T_WoDeShangPinChiFenYeChaXunListRecords = {
    /**
     * 商品编码
     */
    skuCode: string
    /**
     * 商品名称
     */
    skuName: string
    /**
     * 商品分类
     */
    skuCategory: string
    /**
     * 商品封面图
     */
    skuImage: string
    /**
     * 市场价
     */
    markPrice: number
    /**
     * 平台成本
     */
    platformCost: number
    /**
     * 平台供应价
     */
    platformSupplyPrice: any
    /**
     * 销售单位
     */
    unit: string
    /**
     * 品牌
     */
    brandName: string
    /**
     * 市场价利润率
     */
    marketProfitMargin: any
    /**
     * 库存状态名称
     */
    stockStatusName: string
    /**
     * 库存状态
     */
    stockStatus: number
    /**
     * 规格
     */
    saleAttr: string
    /**
     * 创建时间
     */
    createDate: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 渠道自营-商品列表列表
   */
  type T_QuDaoZiYingShangPinLieBiaoListRecords = {
    /**
     *
     */
    id?: number
    /**
     *
     */
    skuName?: string
    /**
     *
     */
    skuCode?: string
    /**
     *
     */
    images?: any
    /**
     *
     */
    unit?: string
    /**
     *
     */
    categoryCode?: string
    /**
     *
     */
    goodsSourceId?: number
    /**
     *
     */
    markPrice?: number
    /**
     *
     */
    taxPurchaseCost?: number
    /**
     *
     */
    noTaxPurchaseCost?: number
    /**
     *
     */
    businessLink?: any
    /**
     *
     */
    desensitizationStatus?: number
    /**
     *
     */
    operStatus?: number
    /**
     *
     */
    supplyId?: number
    /**
     *
     */
    stock?: number
    /**
     *
     */
    freightTemplateId?: any
    /**
     *
     */
    createDate?: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 渠道自营-商品详情Responses
   */
  type T_QuDaoZiYingShangPinXiangQingResponses = {
    /**
     *
     */
    id: number
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
    skuExtCode: string
    /**
     *
     */
    images: any
    /**
     *
     */
    upc69: any
    /**
     *
     */
    brand: string
    /**
     *
     */
    unit: string
    /**
     *
     */
    categoryCode: string
    /**
     *
     */
    goodsSourceId: number
    /**
     *
     */
    markPrice: number
    /**
     *
     */
    taxPurchaseCost: number
    /**
     *
     */
    noTaxPurchaseCost: number
    /**
     *
     */
    invoiceType: number
    /**
     *
     */
    taxCode: string
    /**
     *
     */
    taxRate: number
    /**
     *
     */
    taxPrice: number
    /**
     *
     */
    refundStatus: number
    /**
     *
     */
    operStatus: number
    /**
     *
     */
    supplyId: number
    /**
     *
     */
    stock: number
    /**
     *
     */
    limitSaleFlag: number
    /**
     *
     */
    freightTemplateId: any
    /**
     *
     */
    description: string
    /**
     *
     */
    remarks: any

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
