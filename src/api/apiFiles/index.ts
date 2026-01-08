import request from '@/utils/axios'
class apiFiles_api {
  /**
   * 分类列表(树)
   */
  A_treeList(data: any) {
    return request<API.T_FenLeiLieBiaoShuResponses>({
      url: '/apiCate/treeList',
      method: 'post',
      data: data
    })
  }

  /**
   * 分类详情
   */
  A_getDetail(id: any) {
    return request<API.T_FenLeiXiangQingResponses>({
      url: `/apiCate/detail/${id}`,
      method: 'post'
    })
  }

  /**
   * 删除分类
   */
  A_delete(id: any) {
    return request<any>({
      url: `/apiCate/delete/${id}`,
      method: 'post'
    })
  }

  /**
   * 保存(编辑)分类
   */
  A_apiCateSave(data: any) {
    return request<any>({
      url: '/apiCate/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 通过分类查询接口
   */
  A_listByCateId(data: any) {
    return request<API.T_TongGuoFenLeiChaXunJieKouResponses>({
      url: `/apiInterface/listByCateId`,
      method: 'post',
      data
    })
  }

  /**
   * 接口详情
   */
  A_apiInterfaceDetail(id: any) {
    return request<any>({
      url: `/apiInterface/detail/${id}`,
      method: 'post'
    })
  }

  /**
   * 接口新增编辑
   */
  A_apiInterfaceSave(data: any) {
    return request<any>({
      url: '/apiInterface/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 接口详情
   */
  A_apiInterfaceDelete(id: any) {
    return request<any>({
      url: `/apiInterface/delete/${id}`,
      method: 'post'
    })
  }
  /**
   * 获取公共参数
   */
  A_getPublicParam() {
    return request<any>({
      url: '/apiInterface/common',
      method: 'post'
    })
  }

  /**
   * 意向公司列表
   */

  A_intentionCompanyList(data: any) {
    return request<any>({
      url: '/partner/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 获取接口文档
   */
  A_intentionCompanySave(data: any) {
    return request<any>({
      url: '/partner/save ',
      method: 'post',
      data
    })
  }
}

export default new apiFiles_api()
