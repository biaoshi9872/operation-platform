class system_enum {
  /**
   * 机构类型
   */
  public orgType = [
    {
      value: 1,
      label: '顶级机构'
    },
    {
      value: 2,
      label: '分支机构'
    }
  ]
  public orgType2 = [
    {
      value: 1,
      label: '顶级机构'
    },
    {
      value: 2,
      label: '分支机构'
    },
    {
      value: 3,
      label: '分支机构'
    }
  ]

  /**
   * 加价类型
   */
  public priceMarkupType = [
    {
      value: 1,
      label: '不加价'
    },
    {
      value: 2,
      label: '上调'
    },
    {
      value: 3,
      label: '下调'
    }
  ]
  public getPriceMarkupType(value: any) {
    return this.priceMarkupType.find(item => item.value == value)?.label || '--'
  }

  /**
   * 加价策略
   */
  public priceMarkupStrategy = [
    {
      value: 1,
      label: '%'
    },
    {
      value: 2,
      label: '元'
    }
  ]
  public getPriceMarkupStrategy(value: any) {
    return this.priceMarkupStrategy.find(item => item.value == value)?.label || '--'
  }
}

export default new system_enum()
