// supplychainapi_platform/src/api/announcement/model.d.ts
declare namespace API {
  /**
   * 开放平台公告-分页查询-请求体
   */
  type T_GongGaoFenYeChaXunSearchForm = {
    title?: string
    publisher?: string
    publishTimeStart?: string
    publishTimeEnd?: string
    page: number
    limit: number
    [T: string]: any
  }

  /**
   * 开放平台公告-分页列表-单条记录
   */
  type T_GongGaoFenYeChaXunListRecords = {
    id: number
    title: string
    content: string
    publishTime: string
    publisher: string
    updateBy: number
    updateDate: string
    [T: string]: any
  }

  /**
   * 开放平台公告-新增-请求体
   */
  type T_GongGaoXinZengRequest = {
    title: string
    content: string
    [T: string]: any
  }

  /**
   * 开放平台公告-编辑-请求体
   */
  type T_GongGaoBianJiRequest = {
    id: number
    title: string
    content: string
    [T: string]: any
  }

  /**
   * 开放平台公告-删除-请求体
   */
  type T_GongGaoShanChuRequest = {
    id: number
    [T: string]: any
  }

  /**
   * 开放平台公告-详情-请求体
   */
  type T_GongGaoXiangQingChaXunRequest = {
    id: number
    [T: string]: any
  }

  /**
   * 开放平台公告-详情-响应体
   */
  type T_GongGaoXiangQingResponses = {
    id: number
    title: string
    content: string
    publishTime: string
    publisher: string
    [T: string]: any
  }
}
