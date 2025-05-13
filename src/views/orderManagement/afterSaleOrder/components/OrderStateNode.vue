<script setup lang="ts">
// import { A_getOperationLog } from '@/api/orderManger'
import { useRoute } from 'vue-router'
import eventBus from '@/utils/eventBus'

eventBus.on('afterRefreshEvent', () => {
  getOperationLog()
})

const route = useRoute()
onMounted(() => {
  getOperationLog()
})

//节点状态
const getOperationLog = () => {
  const { afterSaleOrderNo } = route.query
  // afterSaleOrderNo &&
  //   A_getOperationLog({ afterSaleOrderNo }).then((res:any) => {
  //     dataPage.nodeList = res as any[]
  //     dataPage.activeIndex = tranFromActive()
  //   })
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
      <el-step v-for="(item, index) in dataPage.nodeList" :key="index" :title="item.flowNodeName" :description="item.operationTime"></el-step>
    </el-steps>
  </div>
</template>

<style lang="scss" scoped>
.order-state-container {
  width: 100%;
}
</style>
