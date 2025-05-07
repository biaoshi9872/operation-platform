<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny } from '@element-plus/icons-vue'
const isDark = useDark({
  storageKey: 'el-theme-appearance'
})

const toggleDark = useToggle(isDark)

const darkMode = ref(isDark.value)

watch(
  () => darkMode.value,
  () => {
    toggleDark()
  }
)

let resolveFn: (value: boolean | PromiseLike<boolean>) => void
const switchTheme = (event: MouseEvent) => {
  const isAppearanceTransition = document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isAppearanceTransition || !event) {
    resolveFn(true)
    return
  }
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(async () => {
    resolveFn(true)
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}
const beforeChange = (): Promise<boolean> => {
  return new Promise(resolve => {
    resolveFn = resolve
  })
}
</script>

<template>
  <div @click.stop="switchTheme">
    <el-switch v-model="darkMode" :before-change="beforeChange" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
  </div>
</template>
