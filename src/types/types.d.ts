/*
 * @Descripttion:
 * @version:
 * @Author: biao.shi
 * @Date: 2023-02-17 16:37:57
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-07-13 15:35:47
 *
 */

//分页
declare interface Page {
  page: number
  limit: number
  totalCount: number
  [T: string]: any
}
/**
 * 角色标识
 */
declare enum roleCodeEnum {
  // 管理员
  ADMIN = 1
}

/**
 * 字典
 */
declare interface Dict {
  label: string
  value: string | number
  [T: string]: any
  children?: Dict[]
}

/**
 * 操作类型
 */
declare type TOption = 'add' | 'edit' | 'view' | 'preview'

declare interface AxiosConfig {
  timeout?: number
  baseURL?: string
}
