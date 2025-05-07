import request from '@/utils/axios'
class login_api {
  /**
   * 登录
   */
  A_login(data: API.T_DengLuRequest) {
    return request<API.T_DengLuResponses>({
      url: '/system/login',
      method: 'post',
      data: data
    })
  }

  /**
   * 退出登录
   */
  A_loginOut(data: any) {
    return request<any>({
      url: '/system/loginOut',
      method: 'get',
      data: data
    })
  }

  /**
   * 获取当前用户
   */
  A_info(data: any) {
    return request<API.T_HuoQuDangQianYongHuResponses>({
      url: '/sys/user//current/info',
      method: 'get',
      data: data
    })
  }
}

export default new login_api()
