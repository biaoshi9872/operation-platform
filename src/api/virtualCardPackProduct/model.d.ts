declare namespace API {
  type T_ShuZiQuanYiLiBaoShangPinItem = {
    skuCode: string
    skuName: string
    image: string | null
    faceValue: number
    supplyPrice: number
    couponPlatform: number
    taxRate: number
    [T: string]: any
  }

  type T_ShuZiQuanYiLiBaoShengChengRequest = {
    packageName: string
    categoryCode: string
    images: string
    supplyPrice: number
    expireDateMin: string
    expireDateMax: string
    receiveTimes: number
    couponDetail: T_ShuZiQuanYiLiBaoShangPinItem[]
    [T: string]: any
  }

  type T_ShuZiQuanYiLiBaoXiuGaiRequest = T_ShuZiQuanYiLiBaoShengChengRequest & {
    packageCode: string
  }

  type T_ShuZiQuanYiLiBaoXiangQingRequest = {
    packageCode: string
    [T: string]: any
  }

  type T_ShuZiQuanYiLiBaoShanChuRequest = {
    packageCode: string
    [T: string]: any
  }

  type T_ShuZiQuanYiLiBaoTuiSongRequest = {
    appIds: number[]
    packageCodes: string[]
    [T: string]: any
  }

  type T_ShuZiQuanYiLiBaoFenYeSearchForm = {
    page: number
    limit: number
    [T: string]: any
  }

  type T_ShuZiQuanYiLiBaoFenYeLieBiaoListRecords = T_ShuZiQuanYiLiBaoShangPinItem
}
