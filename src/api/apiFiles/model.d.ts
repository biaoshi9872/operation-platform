declare namespace API {
  /**
   * 分类列表(树)Responses
   */
  type T_FenLeiLieBiaoShuResponses = {
    /**
     * 编号
     */
    id: string
    /**
     * 分类名称
     */
    name: string
    /**
     * 等级
     */
    level: number
    /**
     * 描述
     */
    description: string
    /**
     * 父级分类顶级分类传
     */
    parentId: string
    /**
     * 排序
     */
    sort: number
    /**
     * 子节点
     */
    child: any[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 分类详情Responses
   */
  type T_FenLeiXiangQingResponses = {
    /**
     * 编号
     */
    字段参考分类列表: string

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 通过分类查询接口Responses
   */
  type T_TongGuoFenLeiChaXunJieKouResponses = {
    /**
     * 编号
     */
    id: string
    /**
     *
     */
    cateId: string
    /**
     *
     */
    apiName: string
    /**
     *
     */
    description: string
    /**
     *
     */
    reqExample: string
    /**
     *
     */
    resExample: string
    /**
     *
     */
    req: {
      /**
       * 请求字段
       */
      reqColumnId: string
      /**
       * 请求字段名称
       */
      reqColumnName: string
      /**
       * 请求字段类型
       */
      reqColumnType: number
      /**
       * 请求字段是否必填
       */
      reqColumnRequired: any
      /**
       * 请求字段示例
       */
      reqColumnExample: string
      /**
       * 请求字段描述
       */
      reqColumnDescription: string
      /**
       * 子集
       */
      child: any[]

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *
     */
    res: {
      /**
       * 请求字段
       */
      resColumnId: string
      /**
       * 请求字段名称
       */
      resColumnName: string
      /**
       * 请求字段类型
       */
      resColumnType: number
      /**
       * 请求字段是否必填
       */
      resColumnRequired: any
      /**
       * 请求字段示例
       */
      resColumnExample: string
      /**
       * 请求字段描述
       */
      resColumnDescription: string
      /**
       * 子集
       */
      child: any[]

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *
     */
    sort: number

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
