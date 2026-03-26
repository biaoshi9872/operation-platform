<script setup lang="ts">
import order_api from '@/api/order'
import { useRoute } from 'vue-router'
const route = useRoute()
onMounted(() => {
  getOperationLog()
})

const props = defineProps({
  showError: {
    type: Boolean,
    default: false
  }
})
//节点状态
const getOperationLog = () => {
  const { channelOrderNo } = route.query
  order_api.A_getOrderProcess({ channelOrderNo }).then((res: any) => {
    dataPage.nodeList = res as any[]
    dataPage.activeIndex = tranFromActive()
  })
}

const tranFromActive = () => {
  return (
    dataPage.nodeList.findLastIndex((el: any) => {
      return el.completeFlag
    }) + 1
  )
}

const dataPage = reactive({
  nodeList: [] as any[],
  activeIndex: -1
})
</script>

<template>
  <div class="order-state-container">
    <el-steps :active="dataPage.activeIndex" align-center finish-status="success">
      <el-step v-for="(item, index) in dataPage.nodeList" :key="index" :title="item.flowNodeName"
        :description="item.operationTime">
        <template #description>
          <div>{{ item.operationTime }}</div>
          <div v-if="showError && item.remark" class="error">失败原因:{{ item.remark }}</div>
          <div v-if="!showError && item.remark" class="remark_container">备注:{{ item.remark }}</div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<style lang="scss" scoped>
.order-state-container {
  width: 100%;

  .remark_container {
    width: 100%;
    position: absolute;
    transform: translate(27%, 0);
    top: -18px;
    font-size: 16px;
    color: #606266;
  }

  .error {
    font-size: 16px;
    color: var(--el-color-danger-light-3);
  }
}
</style>
