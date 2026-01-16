import request from '@/utils/axios'

class bonusModel_api {
  A_couponPage(data: API.T_LiJianJinFenYeLieBiaoSearchForm) {
    return request<API.T_LiJianJinFenYeLieBiaoResponses>({
      url: '/goods/coupon/page',
      method: 'post',
      data
    })
  }

  A_push(data: any) {
    return request<any>({
      url: '/goods/coupon/push',
      method: 'post',
      data
    })
  }

  A_singPush(data: any) {
    return request({
      url: '/goods/coupon/pushAndRemove',
      method: 'post',
      data
    })
  }

  A_getResultDetail(data: any) {
    return request({
      url: '/goods/coupon/pushFailReason',
      method: 'get',
      data
    })
  }
  A_getDetail(params: any) {
    return request({
      url: '/goods/coupon/detail',
      method: 'post',
      data: params,
      requestOptions: {
        formData: true
      }
    })
  }
  A_export(data: any) {
    return request({
      url: '/goods/coupon/export',
      method: 'post',
      data
    })
  }
}

export default new bonusModel_api()
