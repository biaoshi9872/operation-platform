import request from '@/utils/axios'
class org_api {
  /**
   * 新增编辑机构
   */
  A_save(data: API.T_XinZengBianJiJiGouRequest) {
    return request<any>({
      url: '/sys/org/save',
      method: 'post',
      data: data
    })
  }

  /**
   * 分支机构下拉框
   */
  A_selectList(data: any) {
    return request<API.T_FenZhiJiGouXiaLaKuangListRecords[]>({
      url: '/sys/org/selectList',
      method: 'get',
      data: data
    })
  }

  /**
   * 机构树
   */
  A_orgTree(data: API.T_JiGouShuSearchForm) {
    return request<API.T_JiGouShuListRecords[]>({
      url: 'sys/org/orgTree',
      method: 'post',
      data: data
    })
  }
}

export default new org_api()
