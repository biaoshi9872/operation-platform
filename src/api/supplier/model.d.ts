declare namespace API {
  /**
   * 供应商资料-分页列表列表
   */
  type T_GongYingShangZiLiaoFenYeLieBiaoListRecords = {
    /**
     *
     */
    id?: number
    /**
     *
     */
    supplyName?: string
    /**
     *
     */
    companyName?: string
    /**
     *
     */
    orgId?: number
    /**
     *
     */
    taxpayerType?: number
    /**
     *
     */
    provinceId?: string
    /**
     *
     */
    cityId?: string
    /**
     *
     */
    countyId?: string
    /**
     *
     */
    townId?: string
    /**
     *
     */
    address?: string
    /**
     *
     */
    contractName?: string
    /**
     *
     */
    contractTel?: string
    /**
     *
     */
    bankName?: string
    /**
     *
     */
    bankBranchName?: string
    /**
     *
     */
    bankAccount?: string
    /**
     *
     */
    cooperationStartDate?: any
    /**
     *
     */
    cooperationEndDate?: any
    /**
     *
     */
    remarks?: string
    /**
     *
     */
    qualificationAttachment?: any[]

    /**
     *
     */
    businessScope?: any[]

    /**
     *
     */
    settlementType?: number
    /**
     *
     */
    invoiceType?: number
    /**
     *
     */
    supplementRemarks?: string
    /**
     *
     */
    appAuth?: any
    /**
     *
     */
    enableEnum?: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 供应商 详情Responses
   */
  type T_GongYingShangXiangQingResponses = {
    /**
     *
     */
    id: number
    /**
     *
     */
    supplyName: string
    /**
     *
     */
    companyName: string
    /**
     *
     */
    orgId: number
    /**
     *
     */
    taxpayerType: number
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
    contractName: string
    /**
     *
     */
    contractTel: string
    /**
     *
     */
    bankName: string
    /**
     *
     */
    bankBranchName: string
    /**
     *
     */
    bankAccount: string
    /**
     *
     */
    cooperationStartDate: any
    /**
     *
     */
    cooperationEndDate: any
    /**
     *
     */
    remarks: string
    /**
     *
     */
    qualificationAttachment: any
    /**
     *
     */
    businessScope: any[]

    /**
     *
     */
    settlementType: number
    /**
     *
     */
    invoiceType: number
    /**
     *
     */
    supplementRemarks: string
    /**
     *
     */
    enableEnum: number
    /**
     *
     */
    createDate: string
    /**
     *
     */
    updateDate: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 自有供应商-帐号列表列表
   */
  type T_ZiYouGongYingShangZhangHaoLieBiaoListRecords = {
    /**
     *
     */
    userId?: number
    /**
     *
     */
    accountCode?: string
    /**
     *
     */
    orgId?: number
    /**
     *
     */
    orgName?: any
    /**
     *
     */
    supplyName?: string
    /**
     *
     */
    contractName?: string
    /**
     *
     */
    contractTel?: string
    /**
     *
     */
    businessScope?: any
    /**
     *
     */
    accountValidStart?: string
    /**
     *
     */
    accountValidEnd?: string
    /**
     *
     */
    createTime?: string
    /**
     *
     */
    username?: string
    /**
     *
     */
    status?: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
