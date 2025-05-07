/**工具类型 */

//系统库
/**
 * 该库：系统配置需经常定义扩展，故单独定义
 */
const VITE_DB = import.meta.env.VITE_DB
//字段配置库
/**
 * 该库：字段设置后无特殊场景避免重写初始化导致数据丢失，故单独定义
 */
const VITE_FIELDS_DB = import.meta.env.VITE_FIELDS_DB

let DB = {
  a: VITE_DB,
  b: VITE_FIELDS_DB
}

type TDB = keyof typeof DB

//type P = keyof User

// type renUser<T> = {
//   readonly [U in keyof T]?: T[U]
// }
// type Exclude<T, U> = T extends U ? never : T

// type Rem<T> = { [U in keyof T as never]?: T[U] }
// let obj: Rem<User> = {
//   id:1,
//   a:'1',
//   name: '1',
//   age: 20
// }
// type getUser<T> = {
//   [U in keyof T as `Get${U extends string ? U : never}`]?: T[U]
// }
// let obj:getUser<User>={
//   Getage:1,
//   Getid:1,
//   Getname:1

// }

//type P = keyof typeof HttpStatus
// let demo = {
//   name: '1',
//   age: 20
// }
// type P =  typeof demo
// let obj: P = {
//   name: 1,
//   age: 20
// }
// let obj = {
//   name: '1',
//   age: 20
// }

//Exclude -->过滤

// // type D<T,F extends keyof T>={
// //   [P in F]: T[P]
// // }
// // // type c = D<obj, 'id'>

// // type Pick<T, K extends keyof T> = {
// //   [P in K]: T[P]
// // }
// // type PickUser= Pick<User, 'id' | 'name'>

// type Pick<T, K extends keyof T> = {
//   [T: string]: T[K]
// }
// type PickUser = Pick<{ id: any }, 'id'>
//剔除
// type Exclude<T, U> = T extends U ? never : T
// type CC = Exclude<'a' | 'b' | 'c', 'a'>
// //let a: CC = 'b'

// let obj = {
//   name: '1',
//   age: 1
// }
// type add = (a: string) => void
// //type DD<T> = T extends (infer G)[] ? G : T
// // let arr = ['1']
// // let cc: DD<typeof arr> = '1'
// type DD<T> = T extends (a: infer G) => void ? G : T

// type SS = DD<add>
// let a1: SS = '1'
// type FieldType1 =
//   | 'filedSouseConfig'
//   | 'filedConfig'
//   | 'systemConfig'
//   | 'dictConfig'
//   | 'excelTemplateConfig'
//   | 'supplierConfig'
//   | 'merConfig'
//   | 'orgConfig'
//   | 'logisticConfig'
//字面量类型
// type CC = `A-${FieldType1}`
// let a: CC = 'A-dictConfig'
/**
 * 表名
 */
// type DDD=  keyof any
// type Record<K extends keyof any, T> = {
//   // 原理：
//   // 1.通过keyof拿到所有的K，是一个联合类型。string | number | symbol
//   // 2.迭代K，拿到所有的属性
//   // 3.返回迭代的属性及类型
//   // 注意：此处不能写成 type Record<K, T> = {}; any代表所有key的联合类型。
//   // 否则会报错：不能将类型“K”分配给类型“string | number | symbol”。ts(2322)
//   [P in K]: T
// }

// function mapObj<K extends string | number, T, U>(obj: Record<K, T>, callable: (x: T) => U) {
//   // 声明一个变量
//   let result: Record<K, U> = <Record<K, U>>{}
//   // 遍历传入的对象
//   for (const key in obj) {
//     // 通过callback函数处理result的属性值
//     result[key] = callable(obj[key])
//   }
//   // 返回result
//   return result
// }
// type DDDD = Record<string, string>
// let c: DDDD = {
//   '1': '1'
// }

// let obj = { num1: 1, num2: 2 };
// let callable = (x: number): string => x * 2 + '';
// let newObj = mapObj<string | number, number, string>(obj, callable);
// console.log(newObj); // { num1: '2', num2: '4' }

let obj = {
  c: '1'
}

let objj = {
  a: '1',
  c: '2'
}

type CCC<T> = T extends { d: any } ? true : false

let d: CCC<typeof objj> = true

type FieldType =
  | 'filedSouseConfig'
  | 'filedConfig'
  | 'systemConfig'
  | 'dictConfig'
  | 'excelTemplateConfig'
  | 'supplierConfig'
  | 'merConfig'
  | 'orgConfig'
  | 'logisticConfig'
type DbConfig = {
  name: string
  key: string
  index: string
}
type C = { [K in FieldType]: DbConfig }
const storeList: { [T: string]: any } = {
  [VITE_DB]: {
    systemConfig: {
      name: 'systemConfig', //系统配置表
      key: 'paramKey',
      index: 'id'
    },
    dictConfig: {
      name: 'dictConfig', //字典配置表
      key: 'dictCode',
      index: 'id'
    },
    excelTemplateConfig: {
      name: 'excelTemplateConfig', //模版配置
      key: 'templateType',
      index: 'id'
    },
    supplierConfig: {
      name: 'supplierConfig', //供应商
      key: 'id',
      index: 'id'
    },
    merConfig: {
      name: 'merConfig', //分销商
      key: 'id',
      index: 'id'
    },
    logisticConfig: {
      name: 'logisticConfig', //快递公司
      key: 'id',
      index: 'id'
    },
    orgConfig: {
      name: 'orgConfig', //机构
      key: 'id',
      index: 'id'
    }
  },
  [VITE_FIELDS_DB]: {
    filedSouseConfig: {
      name: 'filedSouseConfig', //字典配置表
      key: 'sourceKey',
      index: 'id'
    },
    filedConfig: {
      name: 'filedConfig', //字典配置表
      key: 'sourceKey',
      index: 'id'
    }
  }
}

export const getStoreListByKey = (key: any): C => {
  return storeList[key] as any
}
