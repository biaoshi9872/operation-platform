export function getImgWidthAndHeightByUrl(url) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = url

    img.onload = function() {
      const result = {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
      img = null
      resolve(result)
    }
    img.onerror = function(e) {
      reject(e)
    }
  })
}

export function downloadImageByUrl(url, { type, name }) {
  const canUseType = ['png', 'jpeg', 'jpg', 'gif']
  const urlMatch = url.match(/([^\.]+)\.(\w+)$/) || []
  const nameMatch = name.match(/([^\.]+)\.(\w+)$/) || []

  if (!type || !canUseType.includes(type)) {
    const urlType = urlMatch[2]
    const nameType = nameMatch[2]
    type = canUseType.includes(urlType) ? urlType
      : canUseType.includes(nameType) ? nameType
        : 'png'
  }

  const fileName = nameMatch[0] || name || `${(urlMatch[1] || (+new Date() + ''))}.${type}`

  let a = document.createElement('a')
  let event = new MouseEvent('click')
  a.download = fileName
  a.href = url
  a.dispatchEvent(event)

  setTimeout(() => {
    a = null
    event = null
  }, 0)
}

/**
 * 通过 canvas 将外部的跨域图片转换为本地地址
 * @param {String} url 跨域图片地址
 * @returns {Promise} dataURL
 */
 export function getLocalImgUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      context.drawImage(img, 0, 0)

      resolve(canvas.toDataURL('image/png'))
    }, false)
    img.addEventListener('error', e => {
      reject(e)
    }, false)
    img.src = url
  })
}
