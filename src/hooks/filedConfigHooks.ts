import { reactive, computed } from 'vue'
import indexedDBHelper from '@/utils/IndexedDB/indexedDBHelper'
//字段--同页签多列表
export default function filedConfigHooks() {
  // 配置信息
  let filedConfigData = reactive({
    mainKey: '',
    subKey: '',
    tagValue: import.meta.env.VITE_TAG_VALUE,
    saveFiledConfigData: false,
    filedConfigList: [], //配置信息
    filedCacheList: [], //缓存信息字段
    filedInfoList: [] //合并逻辑字段信息
  })
  //读取配置信息
  async function getFiledConfigData() {
    console.log(filedConfigData.mainKey, filedConfigData.subKey, 'getFiledConfigData')
    const res = (await indexedDBHelper.fieldsConfig.fieldsSouseConfigQueryByKey(filedConfigData.mainKey)) as any
    console.log(res, 'res')
    if (res && !!res.isShow) return res?.chileList || []
    else return []
  }
  //读取缓存配置信息
  async function getFiledCacheData() {
    console.log(filedConfigData.mainKey, filedConfigData.subKey, 'getFiledConfigData')
    let combinationKey = filedConfigData.mainKey + '-' + filedConfigData.subKey + '-' + filedConfigData.tagValue
    const res = (await indexedDBHelper.fieldsConfig.fieldsConfigQueryByKey(combinationKey)) as any
    console.log(res, 'res')
    let fileList = res?.fileList || '[]'
    return JSON.parse(fileList) || []
  }
  //合并配置信息
  function mergeFiledConfigData(filedConfigList: any, filedCacheList: any) {
    console.log(filedConfigData, filedCacheList)
    filedConfigData.filedConfigList = filedConfigList
    filedConfigData.filedCacheList = filedCacheList
    filedConfigData.filedConfigList.forEach((item: any) => {
      // 1. 合并isShow字段
      let currentCacheItem = filedCacheList.find((cacheItem: any) => {
        return item.sourceKey === cacheItem.sourceKey
      })
      if (currentCacheItem) {
        item.isShow = currentCacheItem.isShow
      }
    })
    filedConfigData.filedInfoList = [...filedConfigList, ...filedCacheList] as []
  }
  //跟新配置信息
  function updateFiledConfigData(filedInfoList: any) {
    console.log(filedConfigData.mainKey, filedConfigData.subKey, 'getFiledConfigData')
    //1.存储逻辑主key和子key
    let combinationKey = filedConfigData.mainKey + '-' + filedConfigData.subKey + '-' + filedConfigData.tagValue
    return indexedDBHelper.fieldsConfig.fieldsConfigSave(combinationKey, filedInfoList)
  }
  // 单个字段信息
  const filedInfo = computed(() => {
    return function (sourceKey: string) {
      return filedConfigData.filedInfoList.find((item: any) => item.sourceKey === sourceKey) || { isShow: true }
    }
  }) as any
  // 单个字段是否显示
  const isFieldShow = computed(() => {
    return function (sourceKey: string) {
      return filedInfo.value(sourceKey)?.isShow
    }
  })
  //获取配置信息
  async function getConfigData(mainKey: string, subKey: string) {
    // filedConfigData.mainKey = mainKey
    // filedConfigData.subKey = subKey
    // const res = (await Promise.all([getFiledConfigData(), getFiledCacheData()])) as any
    // mergeFiledConfigData(res[0], res[1])
  }
  //保存配置信息
  async function saveFiledConfigData(filedInfoList: any) {
    const res = await updateFiledConfigData(filedInfoList)
    return res
  }
  return {
    filedConfigData,
    saveFiledConfigData,
    getConfigData,
    filedInfo,
    isFieldShow
  }
}
