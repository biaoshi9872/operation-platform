// 自定义方法
export interface Icustomize {
  optionTitle: string
}

/**
 * 列表功能
 * @param 删除 delete?(obj: any, title?: string, callFun?: (data: any) => void): Promise<any>
 * @param 查询 selectPage?(obj: any): Promise<any>
 * @param 默认值逻辑处理 searchConvert?(obj: any): void
 * @param 下载中心 toDownloadCenterApi?(obj: any): Promise<any>
 * @param 导出  excelDataList?(obj: any): Promise<any>
 * @param 导出标题  excelTitle?: string
 * @param 自定义方法(此方法必须) customizeFun?(obj: any, callFun?: (data: any) => void): Promise<any>
 * @param 复选[方法]   handleSelectionChange?: (obj: any) => void
 * @param 分页[方法]    pagingQuery?: (obj: any) => void
 * @param 分页    page: Page
 * @param 查询条件    facade?: F
 * @param 其他额外自定义条件     facadeKz?: T
 * @param 数据集合   dataList: any[]
 * @param 加载laoding   loadingData?: boolean
 * @param 导出loading    loadingExport?: boolean
 * @param 当前选中行   dataList: any[]
 * @param 删除key,可自定义     key?: string
 * @param 是否初次加载    isOnload?: boolean
 * @param 复选集合     multipleList?: any[]
 * @param 其他属性     [T: string]: any
 * @param 合并集合      spanArr?: any[]
 * @param 合并key值        mergeKey?: string
 * @param 合并字段       mergeColumns?: any[]
 * @param 接受监听对象     listenerName?: string
 * @param 是否刷新     listRefresh?: boolean
 * @returns
 */

export interface IPage<F, T> {
  //删除
  delete?(obj: any, title?: string, callFun?: (data: any) => void): Promise<any>

  //查询
  selectPage?(obj: any): Promise<any>

  //默认值逻辑处理
  searchConvert?(obj: any): void

  //下载中心
  toDownloadCenterApi?(obj: any): Promise<any>

  //导出
  excelDataList?(obj: any): Promise<any>

  //导出标题
  excelTitle?: string

  //自定义方法(此方法必须)
  customizeFun?(obj: any, callFun?: (data: any) => void): Promise<any>

  //复选[方法]
  handleSelectionChange?: (obj: any) => void

  //查询[方法]
  searchQuery?: (obj: any) => void

  //分页[方法]
  pagingQuery?: (obj: any) => void

  //加载完回
  loadingCallback?: (obj: any) => void

  //分页
  page: Page

  /**查询条件 */
  facade: F

  //其他额外自定义条件
  facadeKz?: any

  //数据集合
  dataList: T[]

  //加载laoding
  loadingData?: boolean

  //导出loading
  loadingExport?: boolean

  //当前选中行
  curryRow?: object

  //删除key,可自定义
  key?: string

  //是否初次加
  isOnload?: boolean

  //复选集合
  multipleList?: any[]

  //其他属性
  [T: string]: any

  //合并集合
  spanArr?: any[]

  //合并key值
  mergeKey?: string

  //合并字段
  mergeColumns?: any[]

  //接受监听对象
  listenerName?: string

  //是否刷新
  listRefresh?: boolean
}
