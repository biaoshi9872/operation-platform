declare namespace API {
  /**
   * 新增角色编辑角色Request
   */
  type T_XinZengJueSeBianJiJueSeRequest = {
    /**
     * 编辑时必穿
     */
    id: any
    /**
     * 角色名称
     */
    roleName: string
    /**
     *
     */
    orgType: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 角色列表查找
   */
  type T_JueSeLieBiaoSearchForm = {
    /**
     * 角色名称
     */
    roleName: string
    /**
     *
     */
    orgType: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 角色列表列表
   */
  type T_JueSeLieBiaoListRecords = {
    /**
     *
     */
    id?: number
    /**
     * 角色名称
     */
    name?: string
    /**
     *
     */
    createRoleType?: number
    /**
     * 角色属于机构
     */
    roleOrgId?: any
    /**
     *
     */
    status?: number
    /**
     * 创建角色用户名称
     */
    createUserName?: string
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
   * 权限页面角色列表查找
   */
  type T_QuanXianYeMianJueSeLieBiaoSearchForm = {
    /**
     * 角色名称
     */
    roleName: string
    /**
     *
     */
    orgType: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 权限页面角色列表列表
   */
  type T_QuanXianYeMianJueSeLieBiaoListRecords = {
    /**
     *
     */
    id: number
    /**
     *
     */
    name: string
    /**
     *
     */
    createRoleType: number
    /**
     * 角色归属机构
     */
    roleOrgId: any
    /**
     *
     */
    status: number
    /**
     *
     */
    createUserName: any
    /**
     *
     */
    createDate: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 新增用户角色列表下拉框列表
   */
  type T_XinZengYongHuJueSeLieBiaoXiaLaKuangListRecords = {
    /**
     *
     */
    id?: number
    /**
     * 名称
     */
    name?: string
    /**
     *
     */
    createRoleType?: number
    /**
     * 角色归属机构
     */
    roleOrgId?: number
    /**
     *
     */
    status?: number
    /**
     *
     */
    createUserName?: any
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
   * 查询角色勾选的权限Request
   */
  type T_ChaXunJueSeGouXuanDeQuanXianRequest = {
    /**
     * 角色
     */
    roleId?: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
