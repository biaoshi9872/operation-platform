import indexedDBHelper from '@/utils/IndexedDB/indexedDBHelper'
type TCache = {
  getSupplierCacheList: () => Promise<any>
  getMerCacheList: () => Promise<any>
  getLogisticCacheList: () => Promise<any>
  getOrgCacheList: () => Promise<any>
  getSystemConfigInfoByKey: (key: string) => Promise<any>
}
export default function (): TCache {
  //供应商
  const getSupplierCacheList = () => {
    return indexedDBHelper.supplierConfig.getAllData()
  }
  //分销账号
  const getMerCacheList = () => {
    return indexedDBHelper.merConfig.getAllData()
  }
  //物流公司
  const getLogisticCacheList = () => {
    return indexedDBHelper.logisticConfig.getAllData()
  }
  //机构
  const getOrgCacheList = () => {
    return indexedDBHelper.orgConfig.getAllData()
  }
  //系统参数
  const getSystemConfigInfoByKey = <T = any>(type: string) => {
    return indexedDBHelper.systemConfig.systemConfigQueryByKey<T>(type)
  }
  // 获取字典
  return {
    getSupplierCacheList,
    getMerCacheList,
    getLogisticCacheList,
    getOrgCacheList,
    getSystemConfigInfoByKey
  }
}
