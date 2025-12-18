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
    <el-steps class="order-steps" :active="dataPage.activeIndex" finish-status="success" align-center>
      <el-step v-for="(item, index) in dataPage.nodeList" :key="index" :title="item.flowNodeName"
        :description="item.operationTime">
        <template #title>
          <div>
            <span>{{ item.operationTime }}</span>
          </div>
        </template>
        <template #description>
          <div class="order-content">
            <span>{{ item.flowNodeName }}</span>
            <span class="order-desc">{{ item.operationDescription }}</span>
          </div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<style lang="scss" scoped>
.order-state-container {
  width: 100%;
}

.order-steps {
  :deep(.el-steps--horizontal) {
    align-items: flex-start;
  }

  :deep(.el-step) {
    position: relative;

    /* 让标题可以定位到节点上方 */
    .el-step__main {
      position: relative;
    }

    .el-step__title {
      position: absolute;
      top: -70px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      color: #6b7280;
      white-space: nowrap;
    }

    .el-step__description {
      margin-top: 10px;
      font-size: 14px;
      color: #333;
      line-height: 22px;

      .order-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .order-node {
          font-size: 16px;
          color: #333;
          line-height: 22px;
        }

        .order-desc {
          max-width: 250px;
          font-size: 14px;
          color: #999;
          line-height: 22px;
        }
      }
    }
  }


}
</style>
