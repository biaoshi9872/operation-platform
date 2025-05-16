import baseEnum from './baseEnum'
class order_enum extends baseEnum {
  /**
   * 订单状态
   */
  public order_states = [
    {
      value: '1',
      label: '待发货'
    },
    {
      value: '2',
      label: '部分发货'
    },
    {
      value: '3',
      label: '已发货'
    },
    {
      value: '6',
      label: '已完成'
    },
    {
      value: '4',
      label: '已取消'
    },
    {
      value: '5',
      label: '取消中'
    },
    {
      value: '9',
      label: '失败'
    }
  ]

  /**
   * 售后状态
   */
  public after_order_states = [
    {
      value: '201',
      label: '待供应商确认'
    },
    {
      value: '101',
      label: '待用户发货'
    },
    {
      value: '202',
      label: '待供应商确认收货'
    },
    {
      value: '203',
      label: '待供应商收货退款'
    },
    {
      value: '204',
      label: '待供应商发货'
    },
    {
      value: '102',
      label: '待用户确认收货'
    },
    {
      value: '1',
      label: '已完成'
    },
    {
      value: '3',
      label: '供应商拒绝'
    },
    {
      value: '2',
      label: '用户取消'
    },
    {
      value: '205',
      label: '待供应商退款'
    }
  ]
  /**
   * 退款枚举
   *  */
  public reasonForRefundListObj: any = {
    //无货退款
    '3': [
      { label: '无货', value: 1 },
      { label: '协商一致取消发货', value: 2 },
      { label: '不想要了', value: 3 }
    ],
    //仅退款
    '2': [
      { label: '商品破损严重', value: 4 },
      { label: '协商一致取消发货', value: 5 },
      { label: '空包裹', value: 6 },
      { label: '快递/物流一直未送到', value: 7 },
      { label: '拒签', value: 8 }
    ],
    '4': [
      { label: '错发', value: 9 },
      { label: '质量问题', value: 10 },
      { label: '七天无理由退货', value: 11 }
    ],
    '1': [
      { label: '实物与商品描述不符', value: 12 },
      { label: '商品质量问题', value: 13 },
      { label: '卖家发错货', value: 14 },
      { label: '与卖家协商一致换货', value: 15 }
    ]
  }

  //售后类型
  public AfterSalesType = [
    {
      value: '4',
      label: '退货退款'
    },
    {
      value: '1',
      label: '换货'
    },
    {
      value: '2',
      label: '仅退款'
    },
    {
      value: '3',
      label: '无货退款'
    }
  ]

  /**
   * 发票类型
   */
  public C_invoiceTypeList = [
    { value: 1, label: '增值税普通发票' },
    { value: 2, label: '增值税专用发票' }
  ]

  //税率
  public C_taxList = [
    { value: 13, label: '13%' },
    { value: 9, label: '9%' },
    { value: 6, label: '6%' },
    { value: 3, label: '3%' },
    { value: 1, label: '1%' },
    { value: 0, label: '0%' },
    { value: -1, label: '免税' }
  ]

  /**
   *
   * 面单是否脱敏
   */
  public C_isMaskList = [
    { value: 1, label: '是' },
    { value: 0, label: '否' }
  ]

  public getMaskNameByKey(key: string) {
    return this.getDictNameByKey(this.C_isMaskList, key)
  }

  /***
    获取枚举值
   */
  public getDictNameByKey(list: any[], key: string) {
    const label =
      list?.find((item: any) => {
        return item.value == key
      })?.label ?? '-'
    return label
  }
}

export default new order_enum()
