import { getStoreListByKey } from './dbListTable'
//打开数据库
//@param {object} dbName 数据库的名字
//@param {string} storeName 仓库名称
//@param {string} version 数据库的版本
//@return {object} 该函数会返回一个数据库实例
export function openDB(dbName: any, version = 1) {
  var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB
  if (!indexedDB) {
    console.log('你的浏览器不支持IndexedDB')
  }
  return new Promise((resolve, reject) => {
    // 兼容浏览器
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    let db
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version)
    //数据库打开成功回调
    request.onsuccess = function (event: any) {
      db = event.target.result //数据库对象
      console.log('数据库打开成功')
      resolve(db)
    }
    //数据库打开失败的回调
    request.onerror = function (event: any) {
      console.log('数据库打开失败', event)
    }
    //数据库有更新时候的回调
    request.onupgradeneeded = function (event: any) {
      console.log('表初始化')
      var db = event.target.result
      var tx = event.transaction || db.transaction
      let storeList = getStoreListByKey(dbName) as any
      // 数据库创建或升级的时候会触发
      Object.keys(storeList).forEach(async (item: any) => {
        const { name } = storeList[item]
        createobjectStore(db, name, storeList[item])
      })
    }
  })
}
//创建表对象
export function createobjectStore(db: any, storeName: any, keys: any) {
  if (!db.objectStoreNames.contains(storeName)) {
    console.log(keys, 'keys')
    let objStore = db.createObjectStore(storeName, {
      keyPath: keys.key,
      autoIncrement: true
    })
    // 新建索引 名称 属性 配置对象
    keys.index.split(',').forEach((key: any) => {
      objStore.createIndex(key, key, { unique: false })
    })
    return objStore
  }
}

/**
 * 插入数据
 * @param db
 * @param storeName
 * @param data
 */
export function addData(db: any, storeName: any, data: any) {
  return new Promise((resolve, reject) => {
    var request = db.transaction([storeName], 'readwrite').objectStore(storeName).add(data)
    request.onsuccess = function (event: any) {
      console.log('数据写入成功')
      resolve(true)
    }

    request.onerror = function (event: any) {
      console.log('数据写入失败')
      reject(false)
    }
  })
}

/**
 * 删除
 * @param id
 */
export function remove(db: any, storeName: any, key: any) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName], 'readwrite')
    var objectStore = transaction.objectStore(storeName)
    var request = objectStore.delete(key)

    request.onsuccess = function (event: any) {
      console.log('数据删除成功')
      resolve(true)
    }

    request.onerror = function (event: any) {
      console.log('数据删除失败')
      resolve(false)
    }
  })
}

/**
 * 跟新数据
 * @param db
 * @param storeName
 * @param data
 */
export function updateDB(db: any, storeName: any, data: any) {
  return new Promise((resolve, reject) => {
    var request = db
      .transaction([storeName], 'readwrite') // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data)
    request.onsuccess = function () {
      console.log('数据更新成功')
      resolve(true)
    }
    request.onerror = function () {
      console.log('数据更新失败')
      reject(false)
    }
  })
}

/**
 * 读取数据：根据key
 * @param db
 * @param storeName
 * @param key
 * @returns
 */
export function getDataByKey(db: any, storeName: any, key: any) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName]) // 事务
    var objectStore = transaction.objectStore(storeName) // 仓库对象
    var request = objectStore.get(key) // 通过主键获取数据
    request.onerror = function (event: any) {
      console.log('事务失败')
      reject(false)
    }
    request.onsuccess = function (event: any) {
      console.log('主键查询结果:', request.result)
      resolve(request.result)
    }
  })
}

/**
 * 查所有
 * @param db
 * @param storeName
 */
export function getAllData(db: any, storeName: any) {
  return new Promise((resolve, reject) => {
    let list: any = []
    var store = db
      .transaction(storeName, 'readwrite') // 事务
      .objectStore(storeName) // 仓库对象
    var request = store.openCursor() // 指针对象
    // 游标开启成功，逐行读数据
    request.onsuccess = function (e: any) {
      var cursor = e.target.result
      if (cursor) {
        // 必须要检查
        list.push(cursor.value)
        cursor.continue() // 遍历了存储对象中的所有内容
      } else {
        console.log('游标读取的数据', list)
        resolve(list)
        return list
      }
    }
    request.onerror = function (e: any) {
      console.log('游标读取失败')
      reject(false)
    }
  })
}

/**
 * 根据索引查询数据
 * @param db
 * @param storeName
 * @param indexName
 * @param indexValue
 */
export function getDataByIndex(db: any, storeName: any, indexName: any, indexValue: any) {
  return new Promise((resolve, reject) => {
    var store = db.transaction(storeName, 'readwrite').objectStore(storeName)
    var request = store.index(indexName).get(indexValue)
    request.onerror = function () {
      console.log('事务失败')
      reject(false)
    }
    request.onsuccess = function (e: any) {
      var result = e.target.result
      console.log('索引查询结果:', result)
      resolve(result)
    }
  })
}

//删除数据库
export function deleteDBAll(dbName: string) {
  return new Promise((resolve, reject) => {
    console.log(dbName)
    let deleteRequest = window.indexedDB.deleteDatabase(dbName)
    deleteRequest.onerror = function (event: any) {
      console.log('删除失败')
      reject(false)
    }
    deleteRequest.onsuccess = function (event: any) {
      console.log('删除成功')
      resolve(true)
    }
  })
}

//关闭数据
export function closeDB(db: any) {
  db.close()
  console.log('数据库已关闭')
}
