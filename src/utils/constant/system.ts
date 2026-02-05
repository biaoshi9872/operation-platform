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

  public getRoleType(value: any) {
    return this.orgType2.find(item => item.value == value)?.label || '--'
  }
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

  /**
   * 盈利模式
   */
  public profitModeList = [
    {
      value: 1,
      label: '扣点'
    },
    {
      value: 2,
      label: '赚差价'
    }
  ]

  public getProfitMode(value: any) {
    return this.profitModeList.find(item => item.value == value)?.label || '--'
  }

  /**
   * 项目类型
   */
  public projectType = [
    {
      value: 1,
      label: '金融API项目'
    },
    {
      value: 2,
      label: '企业(福利)API项目'
    },
    {
      value: 3,
      label: '礼业合作API项目'
    }
  ]
  public getProjectType(value: any) {
    return this.projectType.find(item => item.value == value)?.label || '--'
  }

  /**
   * 兑换状态
   */
  public exchangeStatusList = [
    {
      value: -1,
      label: '兑换失败'
    },
    {
      value: 1,
      label: '兑换中'
    },
    {
      value: 0,
      label: '未兑换'
    },
    {
      value: 2,
      label: '兑换完成'
    }
  ]
  public getExchangeStatusList(value: any) {
    return this.exchangeStatusList.find(item => item.value == value)?.label || '--'
  }
}

export default new system_enum()
