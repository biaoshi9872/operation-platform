/**
 *
 * 定制项目标识
 *
 *
 */

export enum CustomProjectTag {
  PROJECT_NONE = 'NONE',
  //招财运
  PROJECT_CZY = 'CZY'
}

/**
 * 系统配置类型
 */
export type SYS_CONFIG_TYPE = {
  id: number | null
  paramKey: string
  paramValue: string
}
