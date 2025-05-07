import { ref, onMounted, onUnmounted } from 'vue'

export function useDarkMode() {
  const darkMode = ref(localStorage.getItem('el-theme-appearance'))
  const handleStorageChange = (event: any) => {
    if (event.key === 'el-theme-appearance') {
      darkMode.value = event.newValue // 更新响应式变量
    }
  }
  const isDarkMode = computed(() => {
    return darkMode.value === 'light' ? false : true
  })
  onMounted(() => {
    window.addEventListener('storage', handleStorageChange)
  })
  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })

  return { isDarkMode }
}
