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
}

export default new system_enum()
