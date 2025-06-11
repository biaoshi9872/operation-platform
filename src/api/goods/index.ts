import request from '@/utils/axios'
class goods_api {
  A_goodsSourceByOrg(data: any) {
    return request({
      url: '/goodsSource/goodsSourceByOrg',
      method: 'get',
      params: data
    })
  }

  /**
   * 渠道自营-商品列表
   */
  A_page(data: any) {
    return request<API.T_QuDaoZiYingShangPinLieBiaoListRecords[]>({
      url: '/goods/self/page',
      method: 'post',
      data: data
    })
  }

  /**
   * 渠道自营-商品列表 导出
   */
  A_channelSelf(data: any) {
    return request<API.T_QuDaoZiYingShangPinLieBiaoDaoChuListRecords[]>({
      url: '/export/goods/channelSelf',
      method: 'post',
      data: data
    })
  }

  /**
   * 渠道自营-商品新增
   */
  A_save(data: any) {
    return request<any>({
      url: '/goods/self/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 渠道自营-商品修改
   */
  A_update(data: any) {
    return request<any>({
      url: '/goods/self/update',
      method: 'post',
      data: data
    })
  }

  /**
   * 渠道自营-商品详情
   */
  A_getDetail(id: any) {
    return request<API.T_QuDaoZiYingShangPinXiangQingResponses>({
      url: `/goods/self/detail/${id}`,
      method: 'get'
    })
  }

  /**
   * 渠道自营商品 批量上下架
   */
  A_upDown(data: any) {
    return request<any>({
      url: '/goods/self/upDown',
      method: 'post',
      data: data
    })
  }

  /**
   * 渠道自营商品 库存更新
   */
  A_updStock(data: any) {
    return request<any>({
      url: '/goods/self/updStock',
      method: 'post',
      data: data
    })
  }
  /**
   * 渠道自营商品导出
   */

  A_goodsExport(data: any) {
    return request<any>({
      url: '/export/goods/channelSelf',
      method: 'post',
      data: data
    })
  }
}
export default new goods_api()
