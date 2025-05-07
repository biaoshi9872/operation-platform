<!--
 * @Descripttion: 页面容器组件
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-02-23 16:20:19
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-04-20 10:34:59
-->
<script lang="ts" setup>
defineOptions({ name: 'PageContainer' })
const pageInfo = reactive({
  searchHight: 0,
  content: 0,
  optionHight: 0,//操作高度
  tabsHight: 38,//页签高度
  tabHeaderHeight: 50,//表头行高
  paginationHeight: 15,
  layoutHight: 110,//框架剔除高度
})
watchEffect(() => {
  console.log(pageInfo, 'pageInfo')
})



provide('pageInfo', pageInfo)

</script>
<template>
  <div class="l-page-global-container">
    <slot></slot>
  </div>
</template>
<style scoped lang="scss">
.l-page-global-container {
  height: 100%;
}
</style>
