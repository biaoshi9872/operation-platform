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
}
