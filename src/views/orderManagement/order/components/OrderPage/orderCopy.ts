import goodPoor_enum from '@/utils/constant/goodPoor'

const PHYSICAL_SOURCE_TYPE_SET = new Set(
  goodPoor_enum.sourceTypeList
    .filter(item => ['104', '1', '11', '55', '63', '105'].includes(String(item.value)))
    .map(item => String(item.value))
)

const normalizeText = (value: any, fallback = '--') => {
  if (value === null || value === undefined || value === '') {
    return fallback
  }
  return String(value)
}

const getLatestTrack = (deliverInfo: any) => {
  const trackList = deliverInfo?.trackList || []
  return trackList[0] || trackList[trackList.length - 1] || {}
}

const buildGoodsText = (goodsInfo: any[] = []) => {
  return goodsInfo.map((item, index) => {
    return `${index + 1}.商品名称：${normalizeText(item?.skuName)}，商品数量：${normalizeText(item?.goodsNum)}`
  }).join('\n')
}

const buildPhysicalLogisticsText = (orderDeliverExpressList: any[] = []) => {
  if (!orderDeliverExpressList.length) {
    return ''
  }
  return orderDeliverExpressList.map((deliverInfo: any) => {
    const latestTrack = getLatestTrack(deliverInfo)
    const logisticsLine = deliverInfo?.deliveryType === '1'
      ? `物流公司：${normalizeText(deliverInfo?.expressCompanyName)}，快递单号：${normalizeText(deliverInfo?.expressCode)}`
      : `物流公司：自行配送，快递单号：${normalizeText(deliverInfo?.mobile)}`
    const trackDetail = normalizeText(latestTrack?.expressDetail, '')
    const trackTime = normalizeText(latestTrack?.expressTime, '')
    return [logisticsLine, trackDetail, trackTime].filter(Boolean).join('\n')
  }).join('\n\n')
}

const buildPhysicalOrderCopyText = (detailInfo: any) => {
  const orderBaseInfo = detailInfo?.orderBaseInfo || {}
  const receiverInfo = detailInfo?.receiverInfo || {}
  const goodsText = buildGoodsText(detailInfo?.goodsInfo || [])
  const logisticsText = buildPhysicalLogisticsText(detailInfo?.orderDeliverExpressList || [])

  return [
    `下单人手机号：${normalizeText(orderBaseInfo?.buyerPhone)}`,
    `订单时间：${normalizeText(orderBaseInfo?.submitTime)}`,
    `收货人：${normalizeText(receiverInfo?.receiverName)}`,
    `收货人手机号：${normalizeText(receiverInfo?.receiverPhone)}`,
    `收货地址：${normalizeText(receiverInfo?.address)}`,
    `订单号：${normalizeText(orderBaseInfo?.orderNo)}`,
    `渠道订单号：${normalizeText(orderBaseInfo?.channelOrderNo)}`,
    goodsText,
    logisticsText
  ].filter(Boolean).join('\n\n')
}

const buildVirtualOrderCopyText = (detailInfo: any) => {
  const orderBaseInfo = detailInfo?.orderBaseInfo || {}
  const goodsText = buildGoodsText(detailInfo?.goodsInfo || [])

  return [
    `下单人手机号：${String(orderBaseInfo?.buyerPhone ?? null)}`,
    `订单时间：${normalizeText(orderBaseInfo?.submitTime)}`,
    '收货人：--',
    '收货人手机号：--',
    '收货地址：--',
    `订单号：${normalizeText(orderBaseInfo?.orderNo)}`,
    `渠道订单号：${normalizeText(orderBaseInfo?.channelOrderNo, normalizeText(orderBaseInfo?.orderNo))}`,
    goodsText
  ].filter(Boolean).join('\n\n')
}

export const buildOrderCopyText = (detailInfo: any) => {
  const channelSource = String(detailInfo?.channelSource ?? detailInfo?.orderBaseInfo?.channelSource ?? '')
  if (PHYSICAL_SOURCE_TYPE_SET.has(channelSource)) {
    return buildPhysicalOrderCopyText(detailInfo)
  }
  return buildVirtualOrderCopyText(detailInfo)
}

export const copyText = async (text: string) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
