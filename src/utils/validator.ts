

export const validateEmail = (rule: any, value: any, callback: (e?: Error) => any) => {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('邮箱格式不正确'))
  }
}

export const validatePhone = (rule: any, value: any, callback: (e?: Error) => any) => {
  const reg = /^1[3456789]\d{9}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('手机号格式不正确'))
  }
}


export const phoneReg = /^1[0-9]{10}$/

export const emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

//校验密码
export const validatePassword = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (value.length < 6) {
    callback(new Error('密码不能小于6位数'))
  } else if (!hasNumberAndWord.test(value)) {
    callback(new Error('密码必须包含字母加数字，且处于6-20位之间!'))
  } else {
    callback()
  }
}

export const validateMobile = (mobile: string): boolean => {
  return /^1[3456789]\d{9}$/.test(mobile)
}


/**
 * Created on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): Boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str: String): Boolean {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url: string): Boolean {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str: string): Boolean {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str: string): Boolean {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str: string): Boolean {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email: string): Boolean {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str: String): Boolean {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray<T>(arg: T): Boolean {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}



export function validatenull(val: any) {
  if (val instanceof Array) {
    if (val.length == 0) return true;
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true;
  } else {
    if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
    return false;
  }
  return false;

};
// 验证输入浮点数
export function IsDecimal(rule: any, value: any, callback: any) {
  ///为空不进行判断
  if (!value)
    return callback();
  else {
    var reg = /^(\-|\+)?\d+(\.\d+)?$/;
    if (reg.test(value))
      callback();
    else
      callback(new Error('输入格式不正确,请输入数字'));
  }
}
// 验证输入正数
export function IsInt(rule: any, value: any, callback: any) {
  ///为空不进行判断
  if (!value)
    return callback();
  else {
    var reg = /^-?[0-9]\d*$/;
    if (reg.test(value))
      callback();
    else
      callback(new Error('输入格式不正确,请输入整数'));
  }
}
//  手机号验证
export function IsPhoneNumber(value: any) {
  if (!value) {
    return false;
  } else {
    var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (reg.test(value)) {
      return true;
    } else {
      return false;
    }
  }
}

//金额3位小数，大于1
export const numberRegex = /^\D*([1-9]\d*\.?\d{0,3})?.*$/

//折扣
export const beginZeroNumberRegex = /^\D*([0-9]\d*\.?\d{0,3})?.*$/

//数量
export const number = /^(0+)|[^\d]+/g

export const priceRegex = /(^[0-9]{1,9})(\.[0-9]{1,2})?$/

export const hasNumberAndWord = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/

export const urlRegex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/