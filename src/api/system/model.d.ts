declare namespace API {
  /**
   * 登录Request
   */
  type T_DengLuRequest = {
    /**
     *
     */
    username: string
    /**
     *
     */
    pwd: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 登录Responses
   */
  type T_DengLuResponses = {
    /**
     *
     */
    id: number
    /**
     *
     */
    username: string
    /**
     *
     */
    name: string
    /**
     *
     */
    mobile: any
    /**
     *
     */
    status: number
    /**
     *
     */
    createBy: any
    /**
     *
     */
    createTime: any
    /**
     *
     */
    updateBy: any
    /**
     *
     */
    updateDate: any
    /**
     *
     */
    orgId: number
    /**
     *
     */
    orgType: number
    /**
     *
     */
    roleIdList: any[]

    /**
     *
     */
    roleCode: any
    /**
     *
     */
    token: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 获取当前用户Responses
   */
  type T_HuoQuDangQianYongHuResponses = {
    /**
     *
     */
    id: number
    /**
     *
     */
    username: string
    /**
     * 用户昵称
     */
    name: string
    /**
     *
     */
    mobile: any
    /**
     *
     */
    status: number
    /**
     *
     */
    createBy: any
    /**
     *
     */
    createTime: any
    /**
     *
     */
    updateBy: any
    /**
     *
     */
    updateDate: any
    /**
     *
     */
    orgId: number
    /**
     *
     */
    orgType: number
    /**
     *
     */
    roleIdList: any[]

    /**
     *
     */
    roleCode: any
    /**
     * 用户
     */
    token: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
