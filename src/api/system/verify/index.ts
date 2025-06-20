import request from '@/utils/axios'
class verify_api {
  /**
   * 获取验证码
   */
  A_verifyGen() {
    return request({
      url: '/system/gen',
      method: 'post'
    })
  }

  // /**
  //  * 验证验证吗
  //  */
  A_verifyCheck(data: any) {
    return request({
      url: '/system/check',
      method: 'post',
      data
    })
  }

  //http://192.168.31.60:8089/ybt-iomp-api/sys/login/genCaptcha
}

export default new verify_api()
