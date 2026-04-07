declare namespace API {
  /**
   * 应用新增(编辑)Request
   */
  type T_YingYongXinZengBianJiRequest = {
    /**
     * 编辑时必传
     */
    id: number
    /**
     * 应用名称
     */
    appName: string
    /**
     * 开发者邮箱
     */
    developerEmail: string
    /**
     * 开发者手机号
     */
    developerPhone: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 应用列表查找
   */
  type T_YingYongLieBiaoSearchForm = {
    /**
     * 机构列表
     */
    orgIdList: any[]

    /**
     * 应用名称
     */
    appName: string
    /**
     * 创建时间开始
     */
    createDateStart: string
    /**
     * 创建时间结束
     */
    createDateEnd: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 应用列表列表
   */
  type T_YingYongLieBiaoListRecords = {
    /**
     *
     */
    id?: number
    /**
     * 机构
     */
    orgId?: number
    /**
     * 机构名称
     */
    orgName?: string
    /**
     * 应用名称
     */
    appName?: string
    /**
     * 应用编码
     */
    appCode?: string
    /**
     *
     */
    developerEmail?: string
    /**
     * 手机号
     */
    developerPhone?: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 分页查询查找
   */
  type T_FenYeChaXunSearchForm = {
    /**
     * 机构
     */
    orgIdList: any[]

    /**
     * 应用名称
     */
    appName: string
    /**
     * 创建时间开始
     */
    createDateStart: string
    /**
     * 创建时间结束
     */
    createDateEnd: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 分页查询列表
   */
  type T_FenYeChaXunListRecords = {
    /**
     *
     */
    id?: number
    /**
     *
     */
    orgId?: number
    /**
     *
     */
    orgName?: string
    /**
     *
     */
    appName?: string
    /**
     *
     */
    appCode?: string
    /**
     *
     */
    developerEmail?: string
    /**
     *
     */
    developerPhone?: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 更新应用价格风控开关Request
   */
  type T_GengXinYingYongJiaGeFengKongKaiGuanRequest = {
    /**
     * 应用ID
     */
    appId: number
    /**
     * 风控状态：true 开启，false 关闭
     */
    status: boolean

    /**
     * 扩展属性
     */
    [T: string]: any
  }

  /**
   * 查询价格预警变更记录查找
   */
  type T_JiaGeYuJingBianGengJiLuSearchForm = {
    /**
     * 应用ID
     */
    appId: number

    /**
     * 扩展属性
     */
    [T: string]: any
  }

  /**
   * 查询价格预警变更记录列表
   */
  type T_JiaGeYuJingBianGengJiLuListRecords = {
    /**
     * 操作时间，格式：yyyy-MM-dd HH:mm:ss
     */
    operateTime?: string
    /**
     * 操作人
     */
    operateUser?: string
    /**
     * 操作内容
     */
    operateContent?: string

    /**
     * 扩展属性
     */
    [T: string]: any
  }

  /**
   * 应用价格预警分页列表查找
   */
  type T_YingYongJiaGeYuJingFenYeSearchForm = {
    /**
     * 页码，默认 1
     */
    page?: number
    /**
     * 每页条数，默认 10
     */
    limit?: number
    /**
     * 应用ID列表
     */
    appIdList?: number[]
    /**
     * 应用状态：0 禁用，1 正常
     */
    status?: number
    /**
     * 机构ID列表
     */
    orgIdList?: number[]

    /**
     * 扩展属性
     */
    [T: string]: any
  }

  /**
   * 应用价格预警分页列表
   */
  type T_YingYongJiaGeYuJingFenYeListRecords = {
    /**
     * 应用ID
     */
    id?: number
    /**
     * 应用编码
     */
    appCode?: string
    /**
     * 应用名称
     */
    appName?: string
    /**
     * 分支机构名称
     */
    orgName?: string
    /**
     * 应用状态：0 禁用，1 正常
     */
    status?: number
    /**
     * 商品价格风控状态：false 关闭，true 开启
     */
    priceAlarmSwitch?: boolean
    /**
     * 配置人
     */
    configUser?: string
    /**
     * 更新时间，格式：yyyy-MM-dd HH:mm:ss
     */
    updateTime?: string

    /**
     * 扩展属性
     */
    [T: string]: any
  }
}
