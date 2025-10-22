declare namespace API {
  /**
   * API商品关联 新增Request
   */
  type T_APIShangPinGuanLianXinZengRequest = {
    /** 应用ID */
    appId?: number
    /** 商品来源ID */
    goodsSourceId?: any
    /** SKU主键ID */
    skuId?: number
    /** 商品编码 */
    skuCode?: string
    /** 商品名称 */
    skuName?: string
    /** 外部商品编码 */
    outSkuCode?: string
    /** 外部商品名称 */
    outSkuName?: string
    /** 积分比例或费率 */
    jfRate?: number

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * API商品关联 新增Responses
   */
  type T_APIShangPinGuanLianXinZengResponses = {
    /** 信息 */
    msg: string
    /** 状态码 */
    code: number

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * API商品关联 修改Request
   */
  type T_APIShangPinGuanLianXiuGaiRequest = {
    /** 记录ID */
    id?: number
    /** 商品类型 */
    goodsType?: number
    /** 应用ID */
    appId?: number
    /** SKU主键ID */
    skuId?: number
    /** 商品编码 */
    skuCode?: string
    /** 商品名称 */
    skuName?: string
    /** 外部商品编码 */
    outSkuCode?: string
    /** 外部商品名称 */
    outSkuName?: string
    /** 积分比例或费率 */
    jfRate?: number

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * API商品关联 修改Responses
   */
  type T_APIShangPinGuanLianXiuGaiResponses = {
    /** 信息 */
    msg: string
    /** 状态码 */
    code: number

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * API商品关联 分页SearchForm
   */
  type T_APIShangPinGuanLianFenYeSearchForm = {
    /** 商品编码 */
    skuCode?: string

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * API商品关联 分页Responses
   */
  type T_APIShangPinGuanLianFenYeResponses = {
    /** 信息 */
    msg: string
    /** 状态码 */
    code: number

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * 订单重试Request
   */
  type T_DingDanChongShiRequest = {
    /** 异常数据ID */
    dataId: number
    /** 省ID */
    provinceId?: string
    /** 市ID */
    cityId?: string
    /** 区县ID */
    countyId?: string
    /** 乡镇ID */
    townId?: string
    /** 地址 */
    address?: string

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * 订单重试Responses
   */
  type T_DingDanChongShiResponses = {
    /** 信息 */
    msg: string
    /** 状态码 */
    code: number

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * 异常订单列表SearchForm
   */
  type T_YiChangDingDanLieBiaoSearchForm = {
    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * 异常订单列表Responses
   */
  type T_YiChangDingDanLieBiaoResponses = {
    /** 信息 */
    msg: string
    /** 状态码 */
    code: number

    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * 异常订单列表 导出Request
   */
  type T_YiChangDingDanLieBiaoDaoChuRequest = {
    /**  扩展属性 */
    [T: string]: any
  }

  /**
   * 异常订单列表 导出Responses
   */
  type T_YiChangDingDanLieBiaoDaoChuResponses = {
    /** 信息 */
    msg: string
    /** 状态码 */
    code: number

    /**  扩展属性 */
    [T: string]: any
  }
}
