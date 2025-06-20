import request from '@/utils/axios'
class files_api {
  /**
   * 单个上传文件
   */
  A_upload(data: any) {
    debugger
    return request<any>({
      url: '/system/oss/upload',
      method: 'post',
      requestOptions: {
        formData: true
      },
      data: data
    })
  }
  /**
   * 单个上传文件
   */
  A_batchUploaded(data: any) {
    return request<any>({
      url: '/system/oss/batchUpload',
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    })
  }
}

export default new files_api()
