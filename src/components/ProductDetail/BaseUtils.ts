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
  bannerImages: [] //轮播图
}

export function detailTransfer(details: any, goodsSourceType: any) {
  switch (goodsSourceType) {
    //1.京东
    case 1:
      return jdDetailTransfer(details)
    //京东生鲜
    case 11:
      return jdSxDetailTransfer(details)
    //天猫超市
    case 55:
      return tmcsDetailTransfer(details)
    //驿宝通精选
    case 104:
      return ybjxDetailTransfer(details)
    //渠道自营
    case 105:
      return qdzyDetailTransfer(details)
  }
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
/**
 * 京东详情
 * @param details
 */
const jdDetailTransfer = (details: any) => {
  let goodsInfo = cloneDeep(goodDetail)
  goodsInfo = {
    ...goodsInfo,
    ...details
  }
  let saleInfo: any = getStringInfo(details.saleAttr)
  let contentInfo: any = getStringInfo(details.content)
  goodsInfo.title = details.itemName
  goodsInfo.images = details.photoUrl
  goodsInfo.attributeValue1 = '' //saleInfo.color
  goodsInfo.attributeValue2 = '' //saleInfo.size
  goodsInfo.categoryCodeName = details.itemCateName
  goodsInfo.brandName = details.brandName
  goodsInfo.unitName = details.unit
  goodsInfo.description = details.content
  goodsInfo.refundStatus = details.refundStatus
  goodsInfo.bannerImages = details.productImageList.map((el: any) => el.imageUrl)
  return goodsInfo
}
const jdSxDetailTransfer = (details: any) => {
  let goodsInfo = cloneDeep(goodDetail)
  goodsInfo = {
    ...goodsInfo,
    ...details
  }
  let saleInfo: any = getStringInfo(details.saleAttr)
  let contentInfo: any = getStringInfo(details.content)
  goodsInfo.title = details.itemName
  goodsInfo.images = details.photoUrl
  goodsInfo.attributeValue1 = '' //saleInfo.color
  goodsInfo.attributeValue2 = '' //saleInfo.size
  goodsInfo.categoryCodeName = details.itemCateName
  goodsInfo.brandName = details.brandName
  goodsInfo.unitName = details.unit
  goodsInfo.description = details.content
  goodsInfo.refundStatus = details.refundStatus
  goodsInfo.bannerImages = details.productImageList.map((el: any) => el.imageUrl)
  return goodsInfo
}

//天猫超市详情
const tmcsDetailTransfer = (details: any) => {
  let goodsInfo = cloneDeep(goodDetail)
  goodsInfo = {
    ...goodsInfo,
    ...details
  }
  let saleInfo: any = getStringInfo(details.saleAttr)
  let contentInfo: any = getStringInfo(details.content)
  goodsInfo.title = details.itemName
  goodsInfo.images = details.photoUrl
  goodsInfo.attributeValue1 = '' //saleInfo.color
  goodsInfo.attributeValue2 = '' //saleInfo.size
  goodsInfo.categoryCodeName = details.itemCateName
  goodsInfo.brandName = details.brandName
  goodsInfo.unitName = details.unit
  goodsInfo.description = contentInfo.descPath
  goodsInfo.refundStatus = details.refundStatus
  goodsInfo.bannerImages = details.productImageList.map((el: any) => el.imageUrl)
  return goodsInfo
}
//驿宝通精选详情
const ybjxDetailTransfer = (details: any) => {
  let goodsInfo = cloneDeep(goodDetail)
  goodsInfo = {
    ...goodsInfo,
    ...details
  }
  goodsInfo.title = details.title
  goodsInfo.images = details.images
  goodsInfo.attributeValue1 = details.attributeValue1
  goodsInfo.attributeValue2 = details.attributeValue2
  goodsInfo.categoryCodeName = details.categoryCodeName
  goodsInfo.brandName = details.brandName
  goodsInfo.unitName = details.unitName
  goodsInfo.description = details.description
  goodsInfo.refundStatus = details.refundStatus
  return goodsInfo
}

const qdzyDetailTransfer = (details: any) => {
  let goodsInfo = cloneDeep(goodDetail)
  goodsInfo = {
    ...goodsInfo,
    ...details
  }
  goodsInfo.title = details.title
  goodsInfo.images = details.images
  goodsInfo.attributeValue1 = details.attributeValue1
  goodsInfo.attributeValue2 = details.attributeValue2
  goodsInfo.categoryCodeName = details.categoryCodeName
  goodsInfo.brandName = details.brandName
  goodsInfo.unitName = details.unitName
  goodsInfo.description = details.description
  goodsInfo.refundStatus = details.refundStatus
  return goodsInfo
}
