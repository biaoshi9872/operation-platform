export function loadJs(src: any) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    document.body.appendChild(script)

    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject()
    }
  })
}
