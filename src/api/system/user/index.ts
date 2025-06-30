import request from '@/utils/axios'
class user_api {
  /**
   * 用户分页列表
   */
  A_pageList(data: API.T_YongHuFenYeLieBiaoSearchForm) {
    return request<API.T_YongHuFenYeLieBiaoListRecords[]>({
      url: '/sys/user/pageList',
      method: 'post',
      data: data
    })
  }

  /**
   * 新增用户
   */
  A_addUser(data: API.T_XinZengYongHuRequest) {
    return request<any>({
      url: '/sys/user/addUser',
      method: 'post',
      data: data
    })
  }

  /**
   * 更新用户
   */
  A_updateUser(data: API.T_GengXinYongHuRequest) {
    return request<any>({
      url: '/sys/user/updateUser',
      method: 'post',
      data: data
    })
  }

  /**
   * 删除用户
   */
  A_deleteUser(id: any) {
    return request<any>({
      url: `/sys/user/deleteUser/${id}`,
      method: 'post'
    })
  }

  /**
   * 重置密码
   */
  A_resetPwd(data: API.T_ZhongZhiMiMaRequest) {
    return request<any>({
      url: '/sys/user/resetPwd',
      method: 'post',
      data: data
    })
  }

  /**
   * 当前用户信息
   */
  A_info(data: any) {
    return request<API.T_DangQianYongHuXinXiResponses>({
      url: '/sys/user/current/info',
      method: 'get',
      data: data
    })
  }

  /**
   * 用户详情
   * @param id
   * @returns
   */
  A_detail(id: any) {
    return request<any>({
      url: `/sys/user/detail/${id}`,
      method: 'post'
    })
  }

  /**
   * 退出登录
   */
  A_logout() {
    return request<any>({
      url: '/system/loginOut',
      method: 'post'
    })
  }

  /**
   * 发送验证码
   */
  A_sendVerificationCode(data: any) {
    return request<any>({
      url: '/sys/user/sendVerificationCode',
      method: 'post',
      data: data
    })
  }
}

export default new user_api()
