import request from '@/utils/axios'
class virtualCardPackProduct_api {
  A_couponAndVp(data: any) {
    return request<API.T_ShuZiQuanYiLiBaoShangPinItem[]>({
      url: '/virtual/package/goods/couponAndVp',
      method: 'post',
      data
    })
  }

  A_createPackage(data: API.T_ShuZiQuanYiLiBaoShengChengRequest) {
    return request<API.T_ShuZiQuanYiLiBaoShangPinItem[]>({
      url: '/virtual/package/createPackage',
      method: 'post',
      data
    })
  }

  A_updatePackage(data: API.T_ShuZiQuanYiLiBaoXiuGaiRequest) {
    return request<API.T_ShuZiQuanYiLiBaoShangPinItem[]>({
      url: '/virtual/package/updatePackage',
      method: 'post',
      data
    })
  }

  A_detail(data: API.T_ShuZiQuanYiLiBaoXiangQingRequest) {
    return request<API.T_ShuZiQuanYiLiBaoShangPinItem[]>({
      url: '/virtual/package/detail',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data
    })
  }

  A_delPackage(data: API.T_ShuZiQuanYiLiBaoShanChuRequest) {
    return request<any>({
      url: '/virtual/package/delPackage',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data
    })
  }
  A_enable(data: API.T_ShuZiQuanYiLiBaoShanChuRequest) {
    return request<any>({
      url: '/virtual/package/packageStatus',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data
    })
  }
  A_getPackageApp() {
    return request<any>({
      url: '/sys/application/packageApp',
      method: 'get',
      requestOptions: {
        formData: true
      }
    })
  }
  A_push(data: API.T_ShuZiQuanYiLiBaoTuiSongRequest) {
    return request<any>({
      url: '/virtual/package/push',
      method: 'post',
      data
    })
  }
  A_singPush(data: any) {
    return request<any>({
      url: '/virtual/package/pushAndRemove',
      method: 'post',
      data
    })
  }
  A_page(data: API.T_ShuZiQuanYiLiBaoFenYeSearchForm) {
    return request<API.T_ShuZiQuanYiLiBaoFenYeLieBiaoListRecords[]>({
      url: '/virtual/package/page',
      method: 'post',
      data
    })
  }

  A_cateTree(params: any) {
    return request<any>({
      url: '/cate/tree',
      method: 'get',
      params
    })
  }
  A_cateSave(data: any) {
    return request<any>({
      url: '/cate/save',
      method: 'post',
      data
    })
  }
  A_listByLevel(params: any) {
    return request<any>({
      url: '/cate/listByLevel',
      method: 'get',
      params
    })
  }
  A_listUpCate(params: any) {
    return request<any>({
      url: '/cate/listUpCate',
      method: 'get',
      params
    })
  }
}
export default new virtualCardPackProduct_api()
