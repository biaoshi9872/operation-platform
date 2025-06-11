declare namespace API {
  /**
   * 限售模板-地址列表列表
   */
  type T_XianShouMuBanDiZhiLieBiaoListRecords = {
    /**
     *
     */
    labelId: number
    /**
     *
     */
    parentId: number
    /**
     *
     */
    labelName: string
    /**
     *
     */
    children: {
      /**
       *
       */
      labelId: number
      /**
       *
       */
      parentId: number
      /**
       *
       */
      labelName: string
      /**
       *
       */
      children: {
        /**
         *
         */
        labelId: number
        /**
         *
         */
        parentId: number
        /**
         *
         */
        labelName: string

        /**
         *  扩展属性
         */
        [T: string]: any
      }[]

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 限售模板-新增列表
   */
  type T_XianShouMuBanXinZengListRecords = {
    /**
     *
     */
    labelId: number
    /**
     *
     */
    parentId: number
    /**
     *
     */
    labelName: string
    /**
     *
     */
    children: {
      /**
       *
       */
      labelId: number
      /**
       *
       */
      parentId: number
      /**
       *
       */
      labelName: string
      /**
       *
       */
      children: {
        /**
         *
         */
        labelId: number
        /**
         *
         */
        parentId: number
        /**
         *
         */
        labelName: string

        /**
         *  扩展属性
         */
        [T: string]: any
      }[]

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 限售模板-修改列表
   */
  type T_XianShouMuBanXiuGaiListRecords = {
    /**
     *
     */
    labelId: number
    /**
     *
     */
    parentId: number
    /**
     *
     */
    labelName: string
    /**
     *
     */
    children: {
      /**
       *
       */
      labelId: number
      /**
       *
       */
      parentId: number
      /**
       *
       */
      labelName: string
      /**
       *
       */
      children: {
        /**
         *
         */
        labelId: number
        /**
         *
         */
        parentId: number
        /**
         *
         */
        labelName: string

        /**
         *  扩展属性
         */
        [T: string]: any
      }[]

      /**
       *  扩展属性
       */
      [T: string]: any
    }[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 限售模板-详情Responses
   */
  type T_XianShouMuBanXiangQingResponses = {
    /**
     *
     */
    templateId: number
    /**
     *
     */
    templateName: string
    /**
     *
     */
    address: any[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 限售模板-删除 Responses
   */
  type T_XianShouMuBanShanChuResponses = {
    /**
     *
     */
    templateId: number
    /**
     *
     */
    templateName: string
    /**
     *
     */
    address: any[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }

  /**
   * 限售模板-列表Responses
   */
  type T_XianShouMuBanLieBiaoResponses = {
    /**
     *
     */
    templateId: number
    /**
     *
     */
    templateName: string
    /**
     *
     */
    address: any[]

    /**
     *  扩展属性
     */
    [T: string]: any
  }
}
