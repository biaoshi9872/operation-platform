import request from '@/utils/axios'
class virtualCardPackProduct_api {
  async getList(data: any) {
    return request({
      url: '/virtualCardPackProduct/list',
      method: 'get',
      data
    })
  }
}
export default new virtualCardPackProduct_api()
