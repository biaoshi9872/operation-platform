
import { openDB, closeDB, addData, updateDB, getAllData, remove, getDataByKey } from './index'
import { getStoreListByKey } from './dbListTable'

const VITE_DB = import.meta.env.VITE_DB
const VITE_DB_VERSION = import.meta.env.VITE_DB_VERSION
const VITE_FIELDS_DB = import.meta.env.VITE_FIELDS_DB
const VITE_FIELDS_VERSION = import.meta.env.VITE_FIELDS_VERSION

class indexedDBHelper {
  //字典配置
  public dictDb = {

  }


}
export default new indexedDBHelper()
