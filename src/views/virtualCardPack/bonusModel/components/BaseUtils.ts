import { cloneDeep } from 'lodash-es'
const goodDetail = {
  title: '', //名称
  images: '', //主图
  platformSupplyPrice: '', //平台供应价
  platformCost: '', //成本
  markPrice: '', //市场价
  attributeValue1: '', //规格1
  attributeValue2: '', //规格2
  categoryCodeName: '', //分类
  brandName: '', //品牌
  unitName: '', //d单位
  refundStatus: '', //是否7天无理由退货
  description: '', //商品描述
  baseAttributeDto: [], //扩展数据
  goodsBaseAttributeList: [], //扩展数据
  bannerImages: [], //轮播图
  saleInfo: {}, //销售属性
  specification: '', //规格
  source: ''
}

export function detailTransfer(details: any, goodsSourceType: any) {
  return ljjDetailTransfer(details)
}

export function getStringInfo(str: string) {
  let obj = {}
  try {
    obj = JSON.parse(str)
    return obj
  } catch (e) {
    return obj
  }
}

const ljjDetailTransfer = (details: any) => {
  let goodsInfo = cloneDeep(goodDetail)
  goodsInfo = {
    ...goodsInfo,
    ...details
  }
  goodsInfo.title = details.skuName
  goodsInfo.images = details.skuImage
  goodsInfo.attributeValue1 = ''
  goodsInfo.attributeValue2 = ''
  goodsInfo.categoryCodeName = details.skuCategory
  goodsInfo.brandName = ''
  goodsInfo.unitName = ''
  goodsInfo.description = details.useDescription
  goodsInfo.refundStatus = ''
  goodsInfo.source = '108'
  return goodsInfo
}
