// supplychainapi_platform/src/api/announcement/index.ts
import request from '@/utils/axios'
class announcement_api {
  /**
   * 开放平台公告-分页列表
   */
  A_page(data: API.T_GongGaoFenYeChaXunSearchForm) {
    return request<any>({
      url: '/apiInterface/noticeList',
      method: 'post',
      data
    })
  }

  /**
   * 开放平台公告-新增
   */
  A_add(data: API.T_GongGaoXinZengRequest) {
    return request<any>({
      url: '/vsc/notice/insertNotice',
      method: 'post',
      data
    })
  }

  /**
   * 开放平台公告-编辑
   */
  A_update(data: API.T_GongGaoBianJiRequest) {
    return request<any>({
      url: '/vsc/notice/updateNotice',
      method: 'post',
      data
    })
  }

  /**
   * 开放平台公告-删除
   */
  A_delete(data: API.T_GongGaoShanChuRequest) {
    return request<any>({
      url: '/vsc/notice/deleteNotice',
      method: 'post',
      data
    })
  }

  /**
   * 开放平台公告-详情
   */
  A_detail(data: API.T_GongGaoXiangQingChaXunRequest) {
    return request<API.T_GongGaoXiangQingResponses>({
      url: '/apiInterface/noticeDetail',
      method: 'post',
      data
    })
  }
}

export default new announcement_api()
