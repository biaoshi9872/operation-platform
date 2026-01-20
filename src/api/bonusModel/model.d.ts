declare namespace API {
  type T_LiJianJinFenYeLieBiaoSearchForm = {
    skuCode: string
    goodsSourceType: string
    [T: string]: any
  }

  type T_LiJianJinFenYeLieBiaoResponses = {
    msg: string
    code: number
    [T: string]: any
  }

  type T_KaiFangPingTaiShouHouDingDanHuoQuRequest = {
    [T: string]: any
  }

  type T_KaiFangPingTaiShouHouDingDanHuoQuResponses = {
    msg: string
    code: number
    [T: string]: any
  }

  type T_KaiFangPingTaiShangPinXinLieBiaoPageRequest = {
    page: number
    pageSize: number
    source: number
    appId: number
    firstCate?: any
    marketPriceMin: number
    marketPriceMax: number
    [T: string]: any
  }

  type T_KaiFangPingTaiShangPinXinLieBiaoPageResponses = {
    msg: string
    code: number
    [T: string]: any
  }

  type T_KaiFangPingTaiDingDanXiangMuChaXunRequest = {
    orderNoList: string[]
    [T: string]: any
  }

  type T_KaiFangPingTaiDingDanXiangMuChaXunResponses = {
    msg: string
    code: number
    [T: string]: any
  }
}
