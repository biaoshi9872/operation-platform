import request from '@/utils/axios'

//新增编辑类目
export function A_saveCateInfo(data: API.SaveCateInfoParams) {
  return request({
    url: '/goods-v2/productCategory/saveCateInfo',
    method: 'POST',
    data
  })
}

//获取类目树
export function A_getCateInfoTree() {
  return request<API.GetTreeCateInfoData[]>({
    url: '/goods-v2/productCategory/treeCateInfo',
    method: 'POST',
    data: {}
  })
}

//根据类目查询商品列表
export function A_getCateGoryInfo(data: API.GetCateGoryInfoParams) {
  return request<API.GetCateGoryInfoData[]>({
    url: '/goods-v2/productCategory/listUpCateGoryInfo',
    method: 'POST',
    data
  })
}

//根据类目查询商品列表
export function A_getCateGoryInfoByLevel(data: { level: number }) {
  return request<API.GetCateGoryInfoByLevelData[]>({
    url: '/goods-v2/productCategory/listCateGoryInfo',
    method: 'POST',
    data
  })
}

//类目详情
export function A_getCateInfoDetail(data: { id: number }) {
  return request<API.GetCateInfoDetailData>({
    url: '/goods-v2/productCategory/detailCateInfo',
    method: 'POST',
    data
  })
}

//删除类目
export function A_deleteCateInfo(data: { id: number }) {
  return request({
    url: '/goods-v2/productCategory/deleteCateInfo',
    method: 'POST',
    data
  })
}

//保存渠道分类关联关系
export function A_saveChannelRelation(data: API.SaveChannelRelationParams) {
  return request({
    url: '/goods-v2/productCategory/saveChannelRelation',
    method: 'POST',
    data
  })
}

//通过等级获取分类
export function A_getLevelCategory(params: { level: number }) {
  return request<API.GetLevelCategoryData[]>({
    url: '/goods-v2/productCategory/getLevelCategory',
    method: 'GET',
    params
  })
}
