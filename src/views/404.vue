<template>
  <div class="layout-error">
    <el-result icon="error" title="Error Tip" sub-title="Please follow the instructions">
      <template #extra>
        <el-button type="primary" @click="onBack">返回</el-button>
        <el-button type="success" @click="onToHome">首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRouterStore } from '@/stores'
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
  img {
    width: 800px;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
