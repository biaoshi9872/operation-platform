export default function isFlowHooks(el: any) {
  let elDom = el
  //是否溢出
  let isFlow = ref(false)
  //判断元素是否显示。。。
  function isElementInViewport() {
    const dom = elDom.value
    if (dom?.scrollWidth > dom?.clientWidth) {
      isFlow.value = true
    } else {
      isFlow.value = false
    }
  }
  const resizeHandler = () => {
    //2.监听屏幕变化
    console.log('屏幕变化了')
    isElementInViewport()
  }
  //监听屏幕
  onMounted(() => {
    //1.监听屏幕变化
    window.addEventListener('resize', resizeHandler)
  })
  //移除监听
  onUnmounted(() => {
    //3.移除监听
    window.removeEventListener('resize', resizeHandler)
  })
  return {
    isFlow,
    isElementInViewport
  }
}
