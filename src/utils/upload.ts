/*
 * @Descripttion:
 * @version:
 * @Author: biao.shi
 * @Date: 2023-04-11 19:10:01
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-09-18 11:25:06
 */
import { getImgWidthAndHeightByUrl } from './image.js'
import { ElMessage } from 'element-plus'
/**
 * 获取图片文件宽高
 * @param {File} file 文件
 * @returns {Promise} 包含 width height 属性的对象
 */
export function getImgFileWidthAndHeight(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      throw new TypeError('getImgFileWidthAndHeight 参数应为 File 子类')
    }

    const src = URL.createObjectURL(file)

    getImgWidthAndHeightByUrl(src)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        reject(e)
      })
      .finally(() => {
        URL.revokeObjectURL(src)
      })
  })
}

// 获取文件后缀  test11.11.xls ==> xls
export function getFileType(str: any) {
  const match = str.match(/.+\.(\w+)$/)

  return match ? match[1].toLowerCase() : ''
}

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
export const getBlob = (url: any) => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }

    xhr.send()
  })
}
/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
export const saveAs = (blob: any, filename: any) => {
  if (window.navigator?.msSaveOrOpenBlob) {
    navigator?.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    const body = document.querySelector('body')

    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)

    link.click()
    body.removeChild(link)

    window.URL.revokeObjectURL(link.href)
  }
}

// 下载方法
export function downloadExcel(url: any, filename: any) {
  getBlob(url).then((blob: any) => {
    saveAs(blob, filename)
  })
}

/**
 * 处理实现文件下载功能
 * @param {File}  file File 文件
 * @param {string} fileName 下载的文件名称包含后缀（比如：hello.png）
 * */
export function handleUploadFile(file: any, fileName: any) {
  // 创建blob对象
  const blob = new Blob([file])
  // 创建a标签，通过a标签实现下载
  const dom = document.createElement('a')
  dom.download = fileName
  dom.href = URL.createObjectURL(blob)
  dom.id = 'upload-file-dom'
  dom.style.display = 'none'
  document.body.appendChild(dom)

  // 触发点击事件
  dom.click()

  // 释放资源
  URL.revokeObjectURL(dom.href)
  document.getElementById('upload-file-dom')?.remove()
}

//导出--(流方式)
export const downloadFile = async (data: any, filename: string): Promise<any> => {
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
