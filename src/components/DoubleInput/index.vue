<!--
 * @Descripttion: 
 * @version: 
 * @Author: liyanhong
 * @LastEditors: biao.shi
-->
<template>
  <div class="input-wrap">
    <el-input v-model="first" clearable placeholder="请输入" :controls="false" class="mr8"></el-input>
    -
    <el-input v-model="second" clearable placeholder="请输入" :controls="false" class="ml8"></el-input>
  </div>
</template>
<script lang="ts" name="DoubleInput" setup>
import { computed } from 'vue'

const prop = defineProps({
  start: {
    type: String,
    default: ''
  },
  end: {
    type: String,
    default: ''
  }
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update:start', value: any): void
  (e: 'update:end', value: any): void
}>()

const first = computed({
  get() {
    return prop.start
  },
  set(value) {
    emits('update:start', value)
  }
})

const second = computed({
  get() {
    return prop.end
  },
  set(value) {
    emits('update:end', value)
  }
})
</script>
<style scoped lang="scss">
.input-wrap {
  display: inline-flex;
}
</style>
