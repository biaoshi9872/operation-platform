import aes from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'
import modeEcb from 'crypto-js/mode-ecb'
import padPkcs7 from 'crypto-js/pad-pkcs7'
import CryptoJS from 'crypto-js'
/**
 * 加密
 * @param str
 * @param key
 * @returns
 */
export function encrypt(str: string, key = 'e582b9de9cd24d0e9320643bd6ed2c58') {
  return aes
    .encrypt(encUtf8.parse(str), encUtf8.parse(key), {
      mode: modeEcb,
      padding: padPkcs7
    })
    .toString()
}

/**
 * 解密密钥长度不够的问题
 * @param str
 * @param key
 * @returns
 */
export function decrypt(str: string, key = 'e582b9de9cd24d0e9320643bd6ed2c58') {
  return aes
    .decrypt(str, encUtf8.parse(key), {
      mode: modeEcb,
      padding: padPkcs7
    })
    .toString()
}

/**
 *
 */

var key = CryptoJS.enc.Utf8.parse('e582b9de9cd24d0e9320643bd6ed2c58') // 32字节
var iv = CryptoJS.enc.Hex.parse('abcdefghijklmnop')

// 加密
export const encrypted = (str: any) => {
  return CryptoJS.AES.encrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}
// 解密
export const decrypted = (cipherText: any) => {
  return CryptoJS.AES.decrypt(cipherText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
}

//encodeURIComponent
export const strEncodeURIComponent = (str: any) => {
  return encodeURIComponent(str)
}

//decodeURIComponent
export const strDecodeURIComponent = (str: any) => {
  // let deStr = strDecodeURIComponent(str)
  // if (deStr != strDecodeURIComponent(deStr)) {
  //   deStr = strDecodeURIComponent(deStr)
  // }
  return decodeURIComponent(str)
}
