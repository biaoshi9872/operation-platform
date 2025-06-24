class distributionConstant {
  getDictionaryName = (list: any[], value: string | number): any => {
    return list.find(el => el.value == value)?.label || '-'
  }
  prepaidDepositLimitFlagList = [
    {
      label: '有',
      value: 0
    },
    {
      label: '无',
      value: 1
    }
  ]
  getPrepaidDepositLimitFlag(value: any) {
    return this.getDictionaryName(this.prepaidDepositLimitFlagList, value)
  }

  //业务类型 1:预存款充值 2:授权充值 3:售后退货款 4:售后退服务费 5:服务费扣款 6:销户退预存款 7:销户清账
  C_theTypeOfTopUpService = [
    {
      label: '预存款充值',
      value: '1'
    },
    {
      label: '授权充值',
      value: '2'
    },
    {
      label: '售后退款',
      value: '3'
    }
  ]
  getTheTypeOfTopUpService(value: any) {
    return this.getDictionaryName(this.C_theTypeOfTopUpService, value)
  }
  //操作类型
  C_moneyManagementOperationType = [
    {
      label: '销售订单结算',
      value: '0'
    },
    {
      label: '取消销售订单',
      value: '1'
    },
    {
      label: '售后订单退款',
      value: '2'
    },
    {
      label: '充值',
      value: '3'
    }
  ]

  //操作类型
  C_moneyManagementOperationType1 = [
    {
      label: '销售订单结算',
      value: '0'
    },
    {
      label: '取消销售订单',
      value: '1'
    },
    {
      label: '售后订单退款',
      value: '2'
    }
  ]
  getMoneyManagementOperationType(value: any) {
    return this.getDictionaryName(this.C_moneyManagementOperationType, value)
  }
  getMoneyManagementOperationType1(value: any) {
    return this.getDictionaryName(this.C_moneyManagementOperationType, value)
  }
  //处理状态
  C_applyOperationStatus = [
    {
      label: '未处理',
      value: '0'
    },
    {
      label: '已处理',
      value: '1'
    }
  ]
  getApplyOperationStatus(value: any) {
    return this.getDictionaryName(this.C_applyOperationStatus, value)
  }
}

export default new distributionConstant()
