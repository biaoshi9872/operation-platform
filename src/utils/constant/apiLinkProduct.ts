class baseConstant {
  getDictionaryName = (list: any[], value: string | number): any => {
    return list.find(el => el.value == value)?.label || '-'
  }
}

class ycb_enum extends baseConstant {
  /**
   * 商品状态
   */
  E_ShangPinZhuangTai = [
    { label: '上架', value: '2' },
    { label: '下架', value: '1' }
  ]

  /**
   * 获取商品状态
   */
  getE_ShangPinZhuangTai(value: any): string {
    return this.getDictionaryName(this.E_ShangPinZhuangTai, value)
  }

  E_GoodType = [
    { label: '实物', value: 1 },
    { label: '虚拟', value: 2 }
  ]

  /**
   * 获取商品状态
   */
  getE_GoodType(value: any): string {
    return this.getDictionaryName(this.E_GoodType, value)
  }
}

export default new ycb_enum()
