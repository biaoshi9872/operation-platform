declare namespace API {
  /**
   * 用户分页列表查找
   */
  type T_YongHuFenYeLieBiaoSearchForm = {
    /**
     *
     */
    usernameOrPhone: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 用户分页列表列表
   */
  type T_YongHuFenYeLieBiaoListRecords = {
    /**
     *
     */
    id?: number
    /**
     *
     */
    username?: string
    /**
     *
     */
    name?: string
    /**
     *
     */
    mobile?: any
    /**
     *
     */
    roleNameList?: any
    /**
     *
     */
    status?: number
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
   * 新增用户Request
   */
  type T_XinZengYongHuRequest = {
    /**
     * 机构
     */
    orgId: number
    /**
     * 用户名
     */
    username: string
    /**
     * 密码
     */
    password: string
    /**
     * 昵称
     */
    name: string
    /**
     * 手机号
     */
    mobile: string
    /**
     * 角色
     */
    roleIds: any[]

    /**
     * 状态
     */
    status: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 更新用户Request
   */
  type T_GengXinYongHuRequest = {
    /**
     * 字段说明同新增用户
     */
    id: number
    /**
     *
     */
    orgId: number
    /**
     *
     */
    username: string
    /**
     *
     */
    password: string
    /**
     *
     */
    name: string
    /**
     *
     */
    mobile: string
    /**
     *
     */
    roleIds: any[]

    /**
     *
     */
    status: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 重置密码Request
   */
  type T_ZhongZhiMiMaRequest = {
    /**
     * 用户
     */
    id: number
    /**
     * 新密码
     */
    newPwd: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 当前用户信息Responses
   */
  type T_DangQianYongHuXinXiResponses = {
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
}
