class baseEnum {
  public getDictNameByKey(list: any[], key: string | number) {
    const label =
      list?.find((item: any) => {
        return item.value == key
      })?.label ?? '-'
    return label
  }
}

export default baseEnum
