declare namespace API {
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
   * 渠道自营-商品列表 导出列表
   */
  type T_QuDaoZiYingShangPinLieBiaoDaoChuListRecords = {
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
