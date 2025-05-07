declare namespace API {
  /**
   * 新增编辑机构Request
   */
  type T_XinZengBianJiJiGouRequest = {
    /**
     * 编辑时传
     */
    id: any
    /**
     * 机构名称
     */
    name: string
    /**
     * 父机构固定传
     */
    parentOrgId: number
    /**
     *
     */
    status: number
    /**
     * 客户名称
     */
    customerName: string
    /**
     * 项目经理电话
     */
    projectManagerPhone: string
    /**
     * 有效期起始时间
     */
    validateStartTime: string
    /**
     * 有效期结束时间
     */
    validateEndTime: string
    /**
     * 备注
     */
    remark: string
    /**
     * 联系人
     */
    relationPerson: string
    /**
     * 联系人手机号
     */
    relationPhone: string
    /**
     * 省
     */
    relationProvinceId: number
    /**
     * 市
     */
    relationCityId: number
    /**
     * 区
     */
    relationCountryId: number
    /**
     * 详细地址
     */
    relationDetailAddress: string
    /**
     * 营业执照号
     */
    licenseNumber: string
    /**
     * 公司法人
     */
    companyLegalPerson: string
    /**
     * 附件逗号分割
     */
    attachment: string
    /**
     * 管理员用户名称
     */
    username: string
    /**
     * 密码
     */
    password: string
    /**
     * 手机号
     */
    mobile: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 分支机构下拉框列表
   */
  type T_FenZhiJiGouXiaLaKuangListRecords = {
    /**
     *
     */
    id?: number
    /**
     *
     */
    name?: string
    /**
     *
     */
    parentOrgId?: number
    /**
     *
     */
    orgType?: number
    /**
     *
     */
    status?: number
    /**
     *
     */
    customerName?: string
    /**
     *
     */
    projectManagerPhone?: string
    /**
     *
     */
    validateStartTime?: string
    /**
     *
     */
    validateEndTime?: string
    /**
     *
     */
    remark?: string
    /**
     *
     */
    relationPerson?: string
    /**
     *
     */
    relationPhone?: string
    /**
     *
     */
    relationProvinceId?: number
    /**
     *
     */
    relationCityId?: number
    /**
     *
     */
    relationCountryId?: number
    /**
     *
     */
    relationDetailAddress?: string
    /**
     *
     */
    licenseNumber?: string
    /**
     *
     */
    attachment?: string
    /**
     *
     */
    child?: any
    /**
     *
     */
    companyLegalPerson?: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 机构树查找
   */
  type T_JiGouShuSearchForm = {
    /**
     *
     */
    orgName: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 机构树列表
   */
  type T_JiGouShuListRecords = {
    /**
     *
     */
    id?: number
    /**
     *
     */
    name?: string
    /**
     *
     */
    parentOrgId?: number
    /**
     *
     */
    orgType?: number
    /**
     *
     */
    status?: number
    /**
     *
     */
    customerName?: any
    /**
     *
     */
    projectManagerPhone?: any
    /**
     *
     */
    validateStartTime?: any
    /**
     *
     */
    validateEndTime?: any
    /**
     *
     */
    remark?: any
    /**
     *
     */
    relationPerson?: any
    /**
     *
     */
    relationPhone?: any
    /**
     *
     */
    relationProvinceId?: any
    /**
     *
     */
    relationCityId?: any
    /**
     *
     */
    relationCountryId?: any
    /**
     *
     */
    relationDetailAddress?: any
    /**
     *
     */
    licenseNumber?: any
    /**
     *
     */
    attachment?: any
    /**
     *
     */
    child?: {
      /**
       *
       */
      id?: number
      /**
       *
       */
      name?: string
      /**
       *
       */
      parentOrgId?: number
      /**
       *
       */
      orgType?: number
      /**
       *
       */
      status?: number
      /**
       *
       */
      customerName?: string
      /**
       *
       */
      projectManagerPhone?: string
      /**
       *
       */
      validateStartTime?: string
      /**
       *
       */
      validateEndTime?: string
      /**
       *
       */
      remark?: string
      /**
       *
       */
      relationPerson?: string
      /**
       *
       */
      relationPhone?: string
      /**
       *
       */
      relationProvinceId?: number
      /**
       *
       */
      relationCityId?: number
      /**
       *
       */
      relationCountryId?: number
      /**
       *
       */
      relationDetailAddress?: string
      /**
       *
       */
      licenseNumber?: string
      /**
       *
       */
      attachment?: string
      /**
       *
       */
      child?: any
      /**
       *
       */
      companyLegalPerson?: string

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *
     */
    companyLegalPerson?: any

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
