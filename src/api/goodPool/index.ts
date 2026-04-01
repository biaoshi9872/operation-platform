import request from '@/utils/axios'
import goodPoor from '@/utils/constant/goodPoor'
class goodPool_api {
  /**
   * API商品池分页查询
   */
  A_apiGoodsPoolPage(data: API.T_ShangPinChiFenYeChaXunSearchForm) {
    return request<API.T_ShangPinChiFenYeChaXunListRecords[]>({
      url: '/productPool/apiGoodsPoolPage',
      method: 'post',
      data: data
    })
  }

  /**
   * API商品池加入商品池
   */
  A_add(data: API.T_ShangPinChiJiaRuShangPinChiRequest) {
    return request<any>({
      url: '/myGoodsPool/add',
      method: 'post',
      data: data
    })
  }

  /**
   * API商品池/我的商品池详情查询
   */
  A_details(data: API.T_ShangPinChiWoDeShangPinChiXiangQingChaXunRequest) {
    return request<any>({
      url: '/myGoodsPool/details',
      method: 'post',
      data: data
    })
  }

  /**
   * 商品池导出
   */
  A_goodsPoolExport(data: any) {
    return request<any>({
      url: '/export/goods/goodsPoolExport',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池分页查询
   */
  A_myGoodsPoolPage(data: any) {
    return request<any>({
      url: '/myGoodsPool/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-批量改价
   */
  A_batchUpdatePrice(data: any) {
    return request<any>({
      url: '/myGoodsPool/batchUpdatePrice',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-单个改价
   */
  A_updatePrice(data: any) {
    return request<any>({
      url: '/myGoodsPool/updatePrice',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-批量移除（含单个移除）
   */
  A_batchDelete(data: any) {
    return request<any>({
      url: '/myGoodsPool/batchDelete',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-批量上下架（含单个）
   */
  A_batchUpdateStatus(data: any) {
    return request<any>({
      url: '/myGoodsPool/batchUpdateStatus',
      method: 'post',
      data: data
    })
  }

  /**
   * 我的商品池-导出
   */
  A_myGoodsPoolExport(data: any) {
    return request<any>({
      url: '/export/goods/myGoodsPoolExport',
      method: 'post',
      data: data
    })
  }

  A_vpDetails(data: any) {
    return request<any>({
      url: '/order/vp/goodsDetail',
      method: 'post',
      data: data
    })
  }

  /**
   * 更新商品信息
   */
  A_updateGoodInfo(data: any) {
    return request<any>({
      url: '/goods/api/updateExtInfo',
      method: 'post',
      data: data
    })
  }

  /**
   * 批量改价
   */
  A_updatePriceByExcel(data: any) {
    return request<any>({
      url: '/myGoodsPool/updatePriceByExcel',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data: data
    })
  }

  /**
   * 批量推送
   */
  A_addBatch(data: any) {
    return request<any>({
      url: '/myGoodsPool/addBatch',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data: data
    })
  }

  /**
   * 错位数据导出
   */
  A_exportErrHisList(data: any) {
    return request<any>({
      url: '/myGoodsPool/exportErrHisList',
      method: 'post',
      requestOptions: {
        formData: true,
        noCheck: true
      },
      responseType: 'blob',
      params: data
    })
  }

  /**
   * 错位数据列表查询
   */
  A_errHisList(data: any) {
    return request<any>({
      url: '/myGoodsPool/errHisList',
      method: 'get',
      requestOptions: {
        formData: true
      },

      params: data
    })
  }

  /**
   *
   * 商品编辑
   *
   */
  A_updateCouponDetail(data: any) {
    return request<any>({
      url: '/myGoodsPool/updateCouponDetail',
      method: 'post',
      data: data
    })
  }

  /**
   * 商品类型
   */
  async A_getGoodsSourceList(data: any) {
    let { type, appId, orgId } = data
    debugger
    /**
     *
     * 1.顶级机构端查
     *  所有
     * 2.机构端查
     *  应用合集
     * 3.应用端
     * 应用自身合集
     *
     */
    //顶级机构
    if (type == 101) {
      let arr = goodPoor.sourceTypeList.map(item => ({
        id: item.value,
        name: item.label
      }))
      return arr
    }
    //应用端
    if (type == 10 || type == 20) {
      let appAppList = await request<any>({
        url: '/sys/application/detail',
        method: 'get',
        params: {
          appId
        }
      })
      return (
        appAppList?.goodsSourceTypeNameList?.map((item: any) => ({
          id: item.id,
          name: item.sourceName
        })) || []
      )
    }
    //机构端
    if (type == 201) {
      let orgAppList = await request<any>({
        url: '/sys/org/getGoodsSourceByOrgId',
        method: 'get',
        params: {
          orgId
        }
      })
      return goodPoor.sourceTypeList
        .filter(item => orgAppList.includes(Number(item.value)))
        .map(item => ({
          id: item.value,
          name: item.label
        }))
    }
  }
}
export default new goodPool_api()
