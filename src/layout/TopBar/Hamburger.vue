<template>
  <div @click="handleClick" class="hamburger">
    <svg-icon :name="icon"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/index'
const $appStore = useAppStore()

const handleClick = () => {
  $appStore.setSidebarOpened()
}

const icon = computed(() => ($appStore.sidebarOpened ? 'outdent' : 'indent'))
</script>

<style lang="scss" scoped>
.hamburger {
  cursor: pointer;
  font-size: 20px;
  margin-right: 10px;
}
</style>
