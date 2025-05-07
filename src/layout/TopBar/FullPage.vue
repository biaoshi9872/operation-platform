<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
const { isFullscreen, toggle } = useFullscreen()
</script>
<template>
  <svg-icon :name="isFullscreen ? 'unfull' : 'full'" @click="toggle" class="cursor-pointer" />
</template>

