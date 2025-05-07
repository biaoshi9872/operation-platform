import indexedDBHelper from '@/utils/IndexedDB/indexedDBHelper'
const VITE_TAG_VALUE = import.meta.env.VITE_TAG_VALUE

export default function useDBHelper() {
  const initDb = () => {
    //字典初始化
    indexedDBHelper.dictDb.dictInit()
    //系统配置初始化
    indexedDBHelper.systemConfig.systemConfigInit()
    //列设置
    indexedDBHelper.fieldsConfig.fieldsInit()
    //导入模版配置
    indexedDBHelper.excelTemplateConfig.excelTemplateInit()
    //只需要运营端初始化
    if (VITE_TAG_VALUE == '1') {
      //供应商
      indexedDBHelper.supplierConfig.init()
      //分销商
      indexedDBHelper.merConfig.init()
      //机构
      indexedDBHelper.orgConfig.init()
      //机构
      indexedDBHelper.logisticConfig.init()
    }
  }
  return {
    initDb
  }
}
