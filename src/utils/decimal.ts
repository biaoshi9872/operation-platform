import Decimal from 'decimal.js-light'
import { isNullOrUnDefOrisEmpty, isNumber } from './is'
//二次扩展
class MyDecimal {
  private value: Decimal
  private options: any
  constructor(val: any, options: any = { precision: 8 }) {
    this.options = options
    let decimal = val
    //是否为空
    if (isNullOrUnDefOrisEmpty(val)) {
      decimal = 0
    }
    //数字转换
    if (!isNumber(decimal)) {
      decimal = Number(decimal)
    }
    //是否NaN
    if (isNaN(decimal)) {
      decimal = 0
    }
    this.value = new Decimal(decimal)
  }
  //增加
  add(val: MyDecimal) {
    let value = this.value.add(val.value).toFixed(this.options.precision)
    return new MyDecimal(value)
  }
  //减少
  sub(val: MyDecimal) {
    let value = this.value.sub(val.value).toFixed(this.options.precision)
    return new MyDecimal(value)
  }
  //乘法
  mul(val: MyDecimal) {
    let value = this.value.mul(val.value).toFixed(this.options.precision)
    return new MyDecimal(value)
  }
  //除法
  div(val: MyDecimal) {
    let value = this.value.div(val.value).toFixed(this.options.precision)
    return new MyDecimal(value)
  }
  //转字符串
  toString() {
    return this.value.toString()
  }
  //默认8位保存
  toFixed(precision: number = 8) {
    return this.value.toFixed(precision)
  }
  //默认2位显示展示
  toFormat(precision: number = 2) {
    return this.value.toFixed(precision)
  }
  //带符号
  toFormatHasDollar(precision: number = 2) {
    let value = this.value.toFixed(precision)
    return !!value ? `$ ${this.toThousandsNum(value)}` : '-'
  }
  //转千分位
  toThousandsNum(num: any) {
    var numStr = (num || 0).toString()
    return numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }

  //转decimal.js
  toDecimal() {
    return this.value
  }
}

export default MyDecimal
