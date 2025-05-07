import { onMounted, onUnmounted, provide, computed, reactive, onActivated } from 'vue'
import { IPage, Icustomize } from '@/types/from-types'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, debounce } from 'lodash-es'
/**
 * 列表功能
 * @param 导出--（文件方式）  excelDataList
 * @param 导出--(流方式)  downloadFile
 * @param 下载中心 toDownloadCenter
 * @param 删除 deleteItem
 * @param 自定义方法：审核，禁用，启用等   customizeFun
 * @param 查询 selectPage
 * @param 复选  handleSelectionChange
 * @param 查询  searchQuery
 * @param 分页[方法]    pagingQuery?: (obj: any) => void
 * @param 刷新页面    refresh
 * @param 默认查询条件    searchConvert
 * @returns
 */

export default function <F, T>(page: IPage<F, T>) {
  const pageData = reactive(page)
  //当前路由信息
  const router = useRoute()
  const initialOption = reactive({
    page: {} as any,
    facade: {} as any
  })
  //默认字段,默认值
  pageData.loadingData = false
  pageData.loadingExport = false

  //导出--（文件方式）
  const excelDataList = (obj: any, callBack?: () => void) => {
    pageData.loadingExport = true
    pageData.excelDataList &&
      pageData
        .excelDataList(obj)
        .then((res: any) => {
          if (res.code === 0) {
            if (res.url) {
              window.open(res.url)
            }
            ElMessage.success(res.msg)
          }
          callBack && callBack()
        })
        .catch(() => {
          callBack && callBack()
          //ElMessage.error('导出失败！')
        })
        .finally(() => {
          pageData.loadingExport = false
        })
  }

  //导出--(流方式)
  const downloadFile = async (data: any, filename: string): Promise<any> => {
    try {
      // 创建a标签
      const down = document.createElement('a')
      // 文件名没传，则使用时间戳
      down.download = filename || new Date().getTime().toString()
      // 隐藏a标签
      down.style.display = 'none'

      // 创建下载url
      let binaryData = []
      binaryData.push(data)
      down.href = URL.createObjectURL(new Blob(binaryData))
      // 模拟点击下载
      document.body.appendChild(down)
      down.click()

      // 释放URL
      URL.revokeObjectURL(down.href)
      // 下载完成移除
      document.body.removeChild(down)
    } catch (err: any) {
      ElMessage.error(err.message)
    }
  }

  function downloadUrlFile(url: string, filename: string) {
    url = url.replace(/\\/g, '/')
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        // 获取文件blob数据并保存
        downloadFile(xhr.response, filename)
      }
    }
    xhr.send()
  }

  //下载中心
  const toDownloadCenter = async (obj: any): Promise<any> => {
    pageData.loadingExport = true
    try {
      //@ts-ignore
      const res = await pageData.toDownloadCenterApi(obj)
      pageData.loadingExport = false
      if (res.code == 0) {
        ElMessage.success(res.msg)
      }
    } catch (error) {
      pageData.loadingExport = false
    }
  }

  //删除
  const deleteItem = (obj: any, title: string = '提示', conetnt: string = '确认是否删除', callFun?: (data: any) => void) => {
    ElMessageBox.confirm(`${conetnt}`, `${title}`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        //删除
        pageData.delete &&
          pageData.delete({ ...obj }).then((res: any) => {
            ElMessage.success(`删除成功！`)
            callFun && callFun(res)
            //执行刷新
            pagingQuery({ ...pageData.page, ...(pageData.facade as any), ...(pageData.facadeKz as any) })
          })
      })
      .catch(() => {})
  }

  /***
   * 自定义方法：审核，禁用，启用等
   */

  const customizeFun = <T extends Icustomize>(obj: any, option: T, callFun?: (data: any) => void) => {
    ElMessageBox.confirm(`确认是否${option.optionTitle}?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      pageData.customizeFun &&
        pageData.customizeFun({ ...obj, ...pageData.page }).then((res: any) => {
          ElMessage.success(`${option.optionTitle}成功！`)
          //回调函数
          callFun && callFun(res)
          //执行刷新
          pagingQuery({ ...pageData.page, ...(pageData.facade as any), ...(pageData.facadeKz as any) })
        })
    })
  }

  //查询
  const selectPage = (obj: any, callFun?: (res: any) => void) => {
    pageData.loadingData = true
    pageData.selectPage &&
      pageData
        .selectPage(obj)
        .then((res: any) => {
          pageData.dataList = res?.list || res?.page?.records || res?.page?.list || res || ([] as T[])
          pageData.page.totalCount = res?.page?.totalCount || res?.totalRow || res?.page?.totalRow || 0
          pageData.multipleList = []
          pageData.isFist = false
          //合并行
          filterTableData()
          callFun && callFun(res)
        })
        .catch((err: any) => {})
        .finally(() => {
          pageData.loadingData = false
        })
  }

  //复选
  const handleSelectionChange = (obj: any) => {
    pageData.multipleList = obj
  }

  //查询
  const searchQuery = (obj: any, callFun?: (res: any) => void) => {
    selectPage(obj, callFun)
  }
  //分页[方法]
  const pagingQuery = (obj: any, callFun?: (res: any) => void) => {
    selectPage(obj, callFun)
  }

  //刷新页面
  const refresh = () => {
    const obj = searchConvert()
    selectPage(obj)
  }

  //重置
  const handleReset = () => {
    pageData.page = { ...initialOption.page }
    pageData.facade = { ...initialOption.facade }
  }

  //查询条件转换
  const searchConvert = () => {
    let obj = { ...pageData.page, ...(pageData.facade as any), ...(pageData.facadeKz as any) }
    if (Object.hasOwn(pageData, 'searchConvert')) {
      return pageData.searchConvert && pageData.searchConvert(obj)
    } else return obj
  }
  //默认值转换
  const defaultValueConversion = () => {
    if (Object.hasOwn(pageData, 'defaultValueConversion')) {
      pageData.defaultValueConversion()
    }
  }
  onMounted(() => {
    defaultValueConversion()
    const obj = searchConvert()
    !getCurryMenuAuth()?.meta?.isColumnCache && pageData.isOnload && selectPage(obj, pageData.loadingCallback)
    initialOption.page = cloneDeep(pageData.page)
    initialOption.facade = cloneDeep(pageData.facade)
  })

  const getCurryMenuAuth = () => {
    //@ts-ignore
    const menuRoutes = store.routerStore?.menuRoutes
    const curryMenu = menuRoutes
      ?.map((item: any) => item.children)
      .flat(2)
      ?.find((el: any) => el.name == router.name)
    return curryMenu
  }

  //开启列自动刷新功能
  onActivated(async () => {
    if (getCurryMenuAuth()?.meta?.isColumnCache) {
      refresh()
    }
  })
  /**
   *
   * 合并功能
   * @param row
   * @param beforeRow
   * @returns
   */
  const checkMergeState = (row: any, beforeRow: any) => {
    let result = true
    const property = pageData?.mergeKey?.split(',')
    property?.forEach((item: any) => {
      if (row[item] != beforeRow[item]) {
        result = false
      }
    })
    return result
  }

  const filterTableData = () => {
    pageData.spanArr = []
    let contactDot = 0
    pageData.dataList.forEach((item: any, index: any) => {
      if (index == 0) {
        pageData?.spanArr?.push(1)
      } else {
        if (checkMergeState(item, pageData.dataList[index - 1])) {
          //@ts-ignore
          pageData.spanArr[contactDot] += 1
          pageData?.spanArr?.push(0)
        } else {
          contactDot = index
          pageData?.spanArr?.push(1)
        }
      }
    })
  }

  const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
    if (pageData?.mergeColumns?.includes(column.property)) {
      if (pageData?.spanArr?.[rowIndex]) {
        return {
          rowspan: pageData.spanArr[rowIndex],
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }
  }
  provide(
    'tabsInfo',
    computed(() => {
      return pageData.facadeKz
    })
  )
  return {
    deleteItem,
    customizeFun,
    selectPage,
    excelDataList,
    handleSelectionChange,
    searchQuery,
    pagingQuery,
    downloadFile,
    refresh,
    pageData,
    objectSpanMethod,
    toDownloadCenter,
    searchConvert,
    filterTableData,
    handleReset,
    downloadUrlFile
  }
}
