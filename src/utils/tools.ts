import { getLocal } from '@/utils/storage'
import router from "@/router"

// 把路径转换成驼峰命名
export const pathToCamel = (path: string): string => {
  return path.replace(/\/(\w)/g, (all, letter) => letter.toUpperCase())
}

export const getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getDictByKey(key: string) {
  const childList =
    getLocal('dctTypeAll').find((item: any) => {
      return item.dictType === key
    })?.list || []
  return childList
}


export function getNumInUpperCase(num: any) {
  const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const wordArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  const index = numArr.indexOf(num)
  return wordArr[index]
}

//过滤
export const filterTitle = (List: any[], value: any) => {
  console.log('value', List, value)
  return List.find(item => String(item.dictValue) === String(value))?.dictLabel ?? '--'
}

//下载图片
export const downLoadImg = (url: string, filename: string) => {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  eleLink.href = url
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

// 获取路径最后一级
export const getLastItem = (thePath: string) => thePath.substring(thePath.lastIndexOf('/') + 1)

export const getItemKey = (thePath: string) => {
  return thePath.split('/').join('')
}
//触发刷新
export const disUpdated = (name: string) => {
  window.dispatchEvent(
    new CustomEvent('a-business-updated', {
      detail: name // 在detail属性中携带参数
    })
  )
}

//获取缓存组件名称
export const getComponentName = () => {
  let currentMatched = router.currentRoute.value.matched
  let currentComponent = currentMatched[currentMatched.length - 1]?.components?.default
  console.log('currentComponent', currentMatched[currentMatched.length - 1].components)
  let componentName = currentComponent?.name || (currentComponent as { __name: string })?.__name
  // 如果组件内的 script 没有内容，就会返回 undefined
  console.log('componentName', componentName);
  return componentName
}

