declare namespace API {
  /**
   * 菜单管理页面查找
   */
  type T_CaiDanGuanLiYeMianSearchForm = {
    /**
     * 菜单类型
     */
    menuType: number
    /**
     * 菜单名称
     */
    menuName: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 菜单管理页面列表
   */
  type T_CaiDanGuanLiYeMianListRecords = {
    /**
     *
     */
    id: number
    /**
     * 父
     */
    parentId: number
    /**
     * 子菜单
     */
    children: {
      /**
       *
       */
      id?: number
      /**
       *
       */
      parentId?: number
      /**
       *
       */
      children?: {
        /**
         *
         */
        id: number
        /**
         *
         */
        parentId: number
        /**
         *
         */
        children: any[]

        /**
         *
         */
        menuType: number
        /**
         *
         */
        name: string
        /**
         *
         */
        url: any
        /**
         *
         */
        level: any
        /**
         *
         */
        perms: any
        /**
         *
         */
        icon: any
        /**
         *
         */
        sort: any
        /**
         *
         */
        status: number
        /**
         *
         */
        apiPath: any
        /**
         *
         */
        isCache: number
        /**
         *
         */
        isColumnCache: number

        /**
         *  扩展属性
         */
        [T: string]: any
      }[]

      /**
       *
       */
      menuType?: number
      /**
       *
       */
      name?: string
      /**
       *
       */
      url?: any
      /**
       *
       */
      level?: any
      /**
       *
       */
      perms?: any
      /**
       *
       */
      icon?: any
      /**
       *
       */
      sort?: any
      /**
       *
       */
      status?: number
      /**
       *
       */
      apiPath?: any
      /**
       *
       */
      isCache?: number
      /**
       *
       */
      isColumnCache?: number

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     * 菜单类型
     */
    menuType: number
    /**
     * 菜单名称
     */
    name: string
    /**
     * 前端路由
     */
    url: any
    /**
     * 单级别
     */
    level: any
    /**
     * 权限字符串
     */
    perms: any
    /**
     * 图标
     */
    icon: any
    /**
     * 排序
     */
    sort: any
    /**
     *
     */
    status: number
    /**
     * 接口地址与对应不含项目前缀
     */
    apiPath: any
    /**
     * 是否缓存
     */
    isCache: number
    /**
     * 是否开启列缓存
     */
    isColumnCache: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 导航栏列表
   */
  type T_DaoHangLanListRecords = {
    /**
     *
     */
    id: number
    /**
     *
     */
    parentId: number
    /**
     *
     */
    children: {
      /**
       *
       */
      id?: number
      /**
       *
       */
      parentId?: number
      /**
       *
       */
      children?: {
        /**
         *
         */
        id: number
        /**
         *
         */
        parentId: number
        /**
         *
         */
        children: any[]

        /**
         *
         */
        menuType: number
        /**
         *
         */
        name: string
        /**
         *
         */
        url: any
        /**
         *
         */
        level: any
        /**
         *
         */
        perms: any
        /**
         *
         */
        icon: any
        /**
         *
         */
        sort: any
        /**
         *
         */
        status: number
        /**
         *
         */
        apiPath: any
        /**
         *
         */
        isCache: number
        /**
         *
         */
        isColumnCache: number

        /**
         *  扩展属性
         */
        [T: string]: any
      }[]

      /**
       *
       */
      menuType?: number
      /**
       *
       */
      name?: string
      /**
       *
       */
      url?: any
      /**
       *
       */
      level?: any
      /**
       *
       */
      perms?: any
      /**
       *
       */
      icon?: any
      /**
       *
       */
      sort?: any
      /**
       *
       */
      status?: number
      /**
       *
       */
      apiPath?: any
      /**
       *
       */
      isCache?: number
      /**
       *
       */
      isColumnCache?: number

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *
     */
    menuType: number
    /**
     *
     */
    name: string
    /**
     *
     */
    url: any
    /**
     *
     */
    level: any
    /**
     *
     */
    perms: any
    /**
     *
     */
    icon: any
    /**
     *
     */
    sort: any
    /**
     *
     */
    status: number
    /**
     *
     */
    apiPath: any
    /**
     *
     */
    isCache: number
    /**
     *
     */
    isColumnCache: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 顶级机构给其他授权Request
   */
  type T_DingJiJiGouGeiQiTaShouQuanRequest = {
    /**
     * 选中菜单
     */
    selectMenuIds: any[]

    /**
     * 菜单类型
     */
    menuType: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
