/**
 * 枚举字段配置基类
 */
export class baseConstant {
  /**
   * 
   * @param list 字典集合
   * @param value 字典值
   * @returns 字典名称
   */
  getDictionaryName = (list: Dict[], value: string | number, fileName = 'label'): any => {
    return list.find(el => el.value == value)?.[fileName] || '-';
  }
}
