import request from '@/utils/axios'

// 分页列表
export const A_downloadListApi = (data: any) => {
  return request({
    url: '/download/center/list',
    method: 'post',
    data
  })
}
// 下载记录
export const A_downloadRecordApi = (data: any) => {
  return request({
    url: '/download/center/user/history',
    method: 'post',
    data
  })
}
// 下载计数
export const A_downloadCountApi = (data: any) => {
  return request({
    url: `/download/center/count/${data.id}`,
    method: 'post',
    data
  })
}
