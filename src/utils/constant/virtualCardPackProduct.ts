class virtualCardPackProduct_enum {
  public goodsAttrList = [
    {
      value: 'WX_API',
      label: '微信立减金类'
    },
    {
      value: 'ALI_API',
      label: '支付宝立减金类'
    },
    {
      value: 'ZC',
      label: '虚拟直充类'
    },
    {
      value: 'HF',
      label: '虚拟话费'
    }
  ]
  public getGoodsAttrTitle(value: any) {
    return this.goodsAttrList.find(item => item.value == value)?.label || '--'
  }

  public goodsPushStatusList = [
    {
      value: 0,
      label: '未推送'
    },
    {
      value: 1,
      label: '已推送'
    }
  ]
  public getGoodsPushStatusTitle(value: any) {
    return this.goodsPushStatusList.find(item => item.value == value)?.label || '--'
  }

  //0 草稿 ， 1 不可用， 2 可用， 3 删除
  public goodsStatusList = [
    {
      value: 0,
      label: '草稿'
    },
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

  public couponStatusList = [
    {
      value: 0,
      label: '未兑换'
    },
    {
      value: 1,
      label: '处理中'
    },
    {
      value: 2,
      label: '兑换成功'
    },
    {
      value: 3,
      label: '已过期'
    },
    {
      value: 4,
      label: '活动未开始'
    },
    {
      value: -1,
      label: '兑换失败'
    }
  ]
  public getCouponStatusTitle(value: any) {
    return this.couponStatusList.find(item => item.value == value)?.label || '--'
  }

  public packageTypeList = [
    {
      value: 0,
      label: '多商品组合礼包'
    },
    {
      value: 1,
      label: '单商品'
    }
  ]
  public getPackageTypeTitle(value: any) {
    return this.packageTypeList.find(item => item.value == value)?.label || '--'
  }
}

export default new virtualCardPackProduct_enum()
