import { CustomProjectTag } from '@/types/index'
export function getCustomProjectTag(options: any, type: CustomProjectTag, sysValue: string) {
  //默认不定制项目
  let tag = CustomProjectTag.PROJECT_NONE
  /**
   *财兆云项目
   */
  if (type == CustomProjectTag.PROJECT_CZY) {
    const { merchantNo } = options
    if (sysValue.includes(merchantNo)) {
      tag = CustomProjectTag.PROJECT_CZY
    }
  }
  return tag
}
