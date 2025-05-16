import baseEnum from './baseEnum'
class goodPoor_enum extends baseEnum {
  /**
   * 库存状态
   */
  public storeStatus = [
    {
      value: 0,
      label: '无货'
    },
    {
      value: 1,
      label: '有货'
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
      value: 0,
      label: '下架'
    },
    {
      value: 1,
      label: '上架'
    }
  ]
  public getGoodStatusNameByKey(key: number | string) {
    return this.getDictNameByKey(this.goodStatus, key)
  }

  /**
   * 排序
   */
  public sort = [
    {
      value: 0,
      label: '供应价正序'
    },
    {
      value: 1,
      label: '供应价倒序'
    },
    {
      value: 2,
      label: '市场利润率从小到大'
    },
    {
      value: 3,
      label: '市场利润率从大到小'
    },
    {
      value: 4,
      label: '分销利润率从小到大'
    },
    {
      value: 5,
      label: '分销利润率从大到小'
    }
  ]

  /**
   * 价格关系类型
   */
  public priceRelationTypeList = [
    {
      value: 0,
      label: '平台供应价'
    },
    {
      value: 1,
      label: '市场价'
    },
    {
      value: 2,
      label: '分销价'
    }
  ]
  /**
   * 价格比较类型
   */
  public priceCompareTypeList = [
    {
      value: 0,
      label: '小于'
    },
    {
      value: 1,
      label: '等于'
    },
    {
      value: 2,
      label: '大于'
    }
  ]

  /**
   * 渠道类型
   */
  public sourceTypeList = [
    {
      src: 'https://axure-file.lanhuapp.com/md5__1276ee0bba2a3f9c396189e2d0f9f4d0.png',
      label: '驿宝通精选',
      value: '1'
    },
    {
      src: 'https://axure-file.lanhuapp.com/md5__82ff628faa3ab487df2363c52e03f613.png',
      label: '京东',
      value: '2'
    },
    {
      src: 'https://axure-file.lanhuapp.com/md5__fb0a7d465a77ba9c9cecf63a10d02a20.png',
      label: '京东生鲜',
      value: '3'
    }
  ]

  public getSourceTypeNameByKey(key: number | string) {
    return this.getDictNameByKey(this.sourceTypeList, key)
  }
}

export default new goodPoor_enum()
