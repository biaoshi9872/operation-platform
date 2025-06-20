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

  /**
   * 是否组合商品
   */
  public combinationType = [
    { label: '否', value: 1 },
    { label: '是', value: 2 }
  ]
  public getCombinationType = (value: number) => {
    return this.combinationType.find(item => item.value === value)?.label
  }

  /**
   * 是否支持脱敏
   */
  public isSupportMask = [
    { label: '否', value: false },
    { label: '是', value: true }
  ]
  public getDsSupportMask = (value: any) => {
    return this.isSupportMask.find(item => item.value === value)?.label
  }
}

export default new goods_enum()
