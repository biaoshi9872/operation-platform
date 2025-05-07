<!--
 * @Descripttion: 按钮权限--需要用到按钮权限的组件
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-03-27 14:05:08
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-04-18 10:20:33
-->
<script lang="ts" setup>
defineOptions({ name: 'AuthButton' })
const props = defineProps({
  authKey: {
    type: String,
    default: ''
  },
  detail: {
    type: Object,
    default: () => {}
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})

const authObj = computed(() => {
  return {
    authKey: props.authKey,
    detail: props.detail
  }
})
</script>
<template>
  <template class="auth_box">
    <el-button v-bind="$attrs" class="ml-8 auth_button" @click="props.onClick" v-auth="authObj">
      <slot></slot>
    </el-button>
  </template>
</template>
<style scoped lang="scss">
.auth_box {
  display: inline-block;
}
</style>
