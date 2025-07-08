<template>
  <div class="layout-error">
    <div class="mb-24">
      <img :style="{ width: '300px' }" src="@/assets/images/noPermission.png" alt=""></img>
    </div>
    <div class="mb-24">暂无权限</div>
    <div class="mb-24">
      <el-button type="primary" @click="onBack">返回</el-button>
      <el-button type="success" @click="onToHome">首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useRouterStore, useUserStore } from '@/stores'
const router = useRouter()
const $routerStore = useRouterStore()
const getFistRouters = (routers: any) => {
  let routerPath = '/home'
  console.log(routers)
  let routersList = routers.find((el: any) => el.path === '/')?.children?.filter((el: any) => !el.hidden && el.hasOwnProperty('hidden'))
  if (routersList && routersList.length > 0) {
    routerPath = routersList[0].path
  }
  return routerPath
}
const onBack = () => {
  router.back()
}
const onToHome = () => {
  const firstRouter = getFistRouters($routerStore?.routes)
  router.replace(firstRouter)
}
</script>

<style lang="scss" scoped>
.layout-error {
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>