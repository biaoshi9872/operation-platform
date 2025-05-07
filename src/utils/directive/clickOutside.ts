export default {
  mounted(el: any, binding: any) {
    function handleClickOutside(event) {
      // 检查点击事件的目标是否不是当前元素也不是其子元素
      if (!(el === event.target || el.contains(event.target))) {
        // 如果点击发生在外部，则调用绑定的方法
        if (binding.value && typeof binding.value === 'function') {
          binding.value(event)
        }
      }
    }

    // 在 document 上添加点击事件监听器
    document.addEventListener('click', handleClickOutside)

    // 将事件处理函数存储到元素的自定义属性中，以便后续移除
    el._vueClickOutside = handleClickOutside
  },
  beforeUnmount(el: any) {
    // 移除 document 上的点击事件监听器
    if (el._vueClickOutside) {
      document.removeEventListener('click', el._vueClickOutside)
      // 清理自定义属性
      delete el._vueClickOutside
    }
  }
}
