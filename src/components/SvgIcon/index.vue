  <!--
 * @Descripttion:矢量图标 
 * @version: 
 * @Author: biao.shi
 * @Date: 2022-06-13 18:54:45
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-21 09:25:27
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const symbolId = computed(() => `#icon-${props.name}`)
</script>

<script lang="ts">
export default {
  name: 'SvgIcon'
}
</script>

<template>
  <!-- 定义 -->
  <svg aria-hidden="true" class="svg-icon">
    <!-- 复制 -->
    <use :xlink:href="symbolId" fill="currentColor" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
