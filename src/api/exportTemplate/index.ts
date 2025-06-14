import request from '@/utils/axios'
class exportTemplate_api {
  //获取功能列表
  A_templateTypeList() {
    return request({
      url: '/excelTemplate/templateTypeList',
      method: 'get'
    })
  }

  /**
   * 保存
   * @returns
   */
  A_saveExcelTemplate(data: any) {
    return request({
      url: '/excelTemplate/save',
      method: 'POST',
      data
    })
  }

  /**
   * 导入
   * @returns
   */
  A_importExcelTemplate(data: any) {
    return request({
      url: '/excelTemplate/importExcelTemplate',
      method: 'POST',
      requestOptions: {
        formData: true
      },
      data
    })
  }

  /**
   * 列表
   * @param data
   * @returns
   */
  A_excelTemplatePage(data: any) {
    return request({
      url: '/excelTemplate/page',
      method: 'POST',
      data
    })
  }

  /**
   * 新增模板类型
   * @param data
   * @returns
   */
  A_addTemplateType(params: any) {
    return request({
      url: '/excelTemplate/addTemplateType',
      method: 'POST',
      params
    })
  }

  /**
   * 获取模板信息
   * @param data
   * @returns
   */
  A_getOssUrl(params: any) {
    return request({
      url: '/excelTemplate/getOssUrl',
      method: 'get',
      params
    })
  }

  //获取功能列表所有配置
  A_templateTypeAllList() {
    return request({
      url: '/excelTemplate/page',
      method: 'POST',
      data: {
        limit: 100000,
        page: 1
      }
    })
  }
}
export default new exportTemplate_api()
