import baseEnum from './baseEnum'
class bonusModel_enum extends baseEnum {
  //0 草稿 ， 1 不可用， 2 可用， 3 删除
  public goodsStatusList = [
    {
      value: 1,
      label: '不可用'
    },
    {
      value: 2,
      label: '可用'
    }
  ]
  public getGoodsStatusTitle(value: any) {
    return this.goodsStatusList.find(item => item.value == value)?.label || '--'
  }
}

export default new bonusModel_enum()
