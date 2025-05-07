<!--
 * @Descripttion: 
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-03-28 17:09:15
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-03-28 17:11:47
-->
<template>
  <el-link type="primary" :underline="false">
    <el-switch v-bind="$attrs" :active-value="activeValue" :inactive-value="inactiveValue" />
  </el-link>
</template>

<script lang="ts" setup >
defineOptions({ name: 'CSwitch' })
const prop = defineProps({
  value: {
    type: [Boolean, Number, String],
    default: () => { }
  },
  auth: {
    type: String,
    default: () => { }
  },
  activeValue: {
    type: [Boolean, Number, String],
    default: 1
  },
  inactiveValue: {
    type: [Boolean, Number, String],
    default: 0
  },
  isDisabled: {
    type: [Boolean, Number],
    default: () => { }
  }
})
</script>
