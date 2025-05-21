import request from '@/utils/axios'
class goods_api {
  A_goodsSourceByOrg(data: any) {
    return request({
      url: '/goodsSource/goodsSourceByOrg',
      method: 'get',
      params: data
    })
  }
}
export default new goods_api()
