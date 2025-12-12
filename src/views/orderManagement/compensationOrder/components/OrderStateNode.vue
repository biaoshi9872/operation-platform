<script setup lang="ts">
// import { A_getOperationLog } from '@/api/orderManger'
import after_order_api from '@/api/afterOrder'
import eventBus from '@/utils/eventBus'
import { useRoute } from 'vue-router'

eventBus.on('afterRefreshEvent', () => {
  getOperationLog()
})

const route = useRoute()
onMounted(() => {
  getOperationLog()
})

//节点状态
const getOperationLog = () => {
  const { afterSaleNo }: any = route.query
  afterSaleNo &&
    after_order_api.A_progress({ afterSaleNo, bizType: 2 }).then((res: any) => {
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
    <el-steps :active="dataPage.activeIndex" finish-status="success" align-center>
      <el-step v-for="(item, index) in dataPage.nodeList" :key="index" :title="item.flowNodeName"
        :description="item.operationTime"></el-step>
    </el-steps>
  </div>
</template>

<style lang="scss" scoped>
.order-state-container {
  width: 100%;
}
</style>
