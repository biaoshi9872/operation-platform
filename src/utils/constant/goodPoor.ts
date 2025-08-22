import baseEnum from './baseEnum'
class goodPoor_enum extends baseEnum {
  /**
   * 库存状态
   */
  public storeStatus = [
    {
      value: 1,
      label: '有货'
    },
    {
      value: 2,
      label: '无货'
    },
    {
      value: 3,
      label: '库存紧张'
    }
  ]

  public getStoreStatusNameByKey(key: number | string) {
    return this.getDictNameByKey(this.storeStatus, key)
  }
  /**
   * 商品状态
   * @param key
   * @returns
   */
  public goodStatus = [
    {
      value: 1,
      label: '上架'
    },
    {
      value: 2,
      label: '下架'
    }
  ]
  public getGoodStatusNameByKey(key: number | string) {
    return this.getDictNameByKey(this.goodStatus, key)
  }

  /**
   * 渠道状态
   */
  public channelGoodsStatus = [
    {
      value: 1,
      label: '可售'
    },
    {
      value: 2,
      label: '不可售'
    }
  ]
  public getChannelGoodsStatusNameByKey(key: number | string) {
    return this.getDictNameByKey(this.channelGoodsStatus, key)
  }

  /**
   * 排序
   */
  public sort = [
    {
      value: 1,
      label: '供应价正序'
    },
    {
      value: 2,
      label: '供应价倒序'
    },
    {
      value: 3,
      label: '市场利润率从小到大'
    },
    {
      value: 4,
      label: '市场利润率从大到小'
    },
    {
      value: 5,
      label: '分销利润率从小到大'
    },
    {
      value: 6,
      label: '分销利润率从大到小'
    }
  ]

  /**
   * 价格关系类型
   */
  public priceRelationTypeList = [
    {
      value: 1,
      label: '平台供应价'
    },
    {
      value: 2,
      label: '市场价'
    },
    {
      value: 3,
      label: '分销价'
    }
  ]
  /**
   * 价格比较类型
   */
  public priceCompareTypeList = [
    {
      value: 1,
      label: '小于'
    },
    {
      value: 2,
      label: '等于'
    },
    {
      value: 3,
      label: '大于'
    }
  ]

  /**
   * 渠道类型
   * 1	京东
11	京东生鲜
55	天猫超市
104	驿宝通精选
105	渠道自营
   * 
   */
  public sourceTypeList = [
    {
      label: '驿宝通精选',
      value: '104',
      imageUrl: new URL('@/assets/images/poor/ybt.png', import.meta.url).href
    },
    {
      label: '京东',
      value: '1',
      imageUrl: new URL('@/assets/images/poor/jd.png', import.meta.url).href
    },
    {
      label: '京东生鲜',
      value: '11',
      imageUrl: new URL('@/assets/images/poor/jdsx.png', import.meta.url).href
    },
    {
      label: '天猫超市',
      value: '55',
      imageUrl: new URL('@/assets/images/poor/tm.png', import.meta.url).href
    },
    {
      label: '新天猫超市',
      value: '63',
      imageUrl: new URL('@/assets/images/poor/tm.png', import.meta.url).href
    },
    {
      label: '平台虚拟商品',
      value: '106',
      imageUrl: new URL('@/assets/images/poor/ptjx.png', import.meta.url).href
    },
    {
      label: '渠道自营',
      value: '105',
      imageUrl: new URL('@/assets/images/poor/zy.png', import.meta.url).href
    }
  ]

  //渠道类型。电商渠道
  public D_sourceTypeList = [1, 11, 55, 63, 105]

  //自营类型。
  public Z_sourceTypeList = [104, 106]

  public getSourceTypeNameByKey(key: number | string) {
    return this.getDictNameByKey(this.sourceTypeList, key)
  }

  /**
   * 虚拟产品类型
   */
  public vpProductTypeList = [
    {
      value: 'KM',
      label: '卡密'
    },
    {
      value: 'ZC',
      label: '直充'
    },
    {
      value: 'HF',
      label: '话费'
    }
  ]

  public getVpProductTypeNameByKey(key: number | string) {
    return this.getDictNameByKey(this.vpProductTypeList, key)
  }
}

export default new goodPoor_enum()
