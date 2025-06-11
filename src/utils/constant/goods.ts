import baseEnum from './baseEnum'
class goods_enum extends baseEnum {
  /**
   * 商品状态
   */
  public operStatus = [
    { label: '草稿', value: 0 },
    { label: '下架', value: 2 },
    { label: '上架', value: 1 }
  ]
  public getOperStatus = (value: number) => {
    return this.operStatus.find(item => item.value === value)?.label
  }
}

export default new goods_enum()
