class supplier_enum {
  // 供应商类型：1-供应商 2-客户
  public supplierType = [
    {
      value: 1,
      label: '供应商'
    },
    {
      value: 2,
      label: '客户'
    }
  ]

  // 纳税人规模：1-一般纳税人 2-小规模纳税人
  public taxpayerScale = [
    {
      value: 1,
      label: '一般纳税人'
    },
    {
      value: 2,
      label: '小规模纳税人'
    }
  ]

  // 经营范围：1-实物商品
  public businessScope = [
    {
      value: 1,
      label: '实物商品'
    }
  ]

  // 结算方式：0-周结 1-月结 2-季结 3-年结 4-预付
  public settlementType = [
    {
      value: 0,
      label: '周结'
    },
    {
      value: 1,
      label: '月结'
    },
    {
      value: 2,
      label: '季结'
    },
    {
      value: 3,
      label: '年结'
    },
    {
      value: 4,
      label: '预付'
    }
  ]

  // 开票类型：2-专票 1-普票 0-不开发票
  public invoiceType = [
    {
      value: 2,
      label: '专票'
    },
    {
      value: 1,
      label: '普票'
    },
    {
      value: 3,
      label: '不开发票'
    }
  ]

  public accountStatus = [
    {
      value: 1,
      label: '启用'
    },
    {
      value: 0,
      label: '禁用'
    }
  ]
  public getAccountStatus(value: string) {
    return this.accountStatus.find(item => item.value == value)?.label || '--'
  }

  // 获取供应商类型标签
  public getSupplierType(value: any) {
    return this.supplierType.find(item => item.value == value)?.label || '--'
  }

  // 获取纳税人规模标签
  public getTaxpayerScale(value: any) {
    return this.taxpayerScale.find(item => item.value == value)?.label || '--'
  }

  // 获取经营范围标签
  public getBusinessScope(value: any) {
    return this.businessScope.find(item => item.value == value)?.label || '--'
  }

  // 获取结算方式标签
  public getSettlementType(value: any) {
    return this.settlementType.find(item => item.value == value)?.label || '--'
  }
  // 获取开票类型标签
  public getInvoiceType(value: any) {
    return this.invoiceType.find(item => item.value == value)?.label || '--'
  }
}

export default new supplier_enum()
