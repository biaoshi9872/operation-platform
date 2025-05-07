<script setup lang="ts">
import UserInfo from './UserInfo.vue'
import FullPage from './FullPage.vue'
import useIsEevCheckHooks from '@/hooks/isEevCheckHooks'
const { isUat } = useIsEevCheckHooks({})

</script>

<template>
  <div class="top-bar">
    <div class="top-left-info">
    </div>
    <div class="top-info">
      <h3 v-if="isUat" class="mr-8">uat环境</h3>
      <RouterLink to="/downloadCenter" class="mr-16 down-info">下载中心</RouterLink>
      <FullPage />
      <el-divider class="top-info-divider" direction="vertical"></el-divider>
      <UserInfo />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  height: 50px;
  z-index: 88;
  flex: 1;

  .top-left-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .breadcrumb-wrap {
    padding: 8px 8px 8px 0;
    font-size: 14px;
    border-radius: 2px;
    line-height: 20px;
    display: flex;
    align-items: center;
  }

  .top-info {
    display: flex;
    align-items: center;
    border-radius: 2px;
    .full-big-container {
      cursor: pointer;
    }
    .top-info-divider {
      margin: 0 20px;
    }
    .down-info {
      color: var(--el-color-primary);
      text-decoration: underline;
    }
  }
}
</style>
