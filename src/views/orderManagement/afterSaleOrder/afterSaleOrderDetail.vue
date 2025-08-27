<script setup lang="ts">
defineOptions({
  name: 'AfterSaleOrderDetail'
})
import after_order_api from '@/api/afterOrder/index'
import order_enum from '@/utils/constant/order'
import { useRoute } from 'vue-router'
import OrderInfoCell from './components/OrderInfoCell.vue'
import OrderLogisticCell from './components/OrderLogisticCell.vue'
import OrderProductCell from './components/OrderProductCell.vue'
import OrderReturnInfo from './components/OrderReturnInfo.vue'
import OrderReturnLogistic from './components/OrderReturnLogistic.vue'
import OrderReturnUserInfo from './components/OrderReturnUserInfo.vue'
import OrderStateNode from './components/OrderStateNode.vue'
const route = useRoute()

interface IData {
  detail: {
    afterSaleNo: String
    applyTime: String
    orderNo: String
    afterSaleType: String
    merchantName: String
    applyUserName: String
    applyUserMobile: String
    supplyName: String
    reasonName: String
    reasonDescription: String
    currentFlowNodeName: String
    currentFlowNodeCode: String
    cancelReason: String
    rejectReason: String
    channelSource: '1' | '2' //1.平台 2京东
    expressCode: ''
    status: String
    orderDeliverVOList: any //物流信息
    receiveUserInfo: any //仓库信息
    sendUserInfo: any
  }
  showReasonFlag: Boolean
  showAuditFlag: Boolean
  showOrderReturnLogistic: Boolean
}

const dataPage = reactive<IData>({
  detail: {
    afterSaleNo: '',
    applyTime: '',
    orderNo: '',
    afterSaleType: '',
    merchantName: '',
    applyUserName: '',
    applyUserMobile: '',
    supplyName: '',
    reasonName: '',
    reasonDescription: '',
    currentFlowNodeCode: '',
    currentFlowNodeName: '',
    cancelReason: '',
    rejectReason: '',
    channelSource: '1', //1京东 2平台
    expressCode: '',
    status: '',
    orderDeliverVOList: [],
    receiveUserInfo: {},
    sendUserInfo: {}
  },
  showReasonFlag: false,
  showAuditFlag: false,
  showOrderReturnLogistic: false
})

onMounted(async () => {
  init()
})

const init = () => {
  queryAfterSaleOrderInfo()
}

//订单详情
const queryAfterSaleOrderInfo = () => {
  const { afterSaleNo }: any = route.query
  after_order_api.A_detail({ afterSaleNo }).then((res: any) => {
    dataPage.detail = {
      ...dataPage.detail,
      ...res
    }
    //自营换货需要显示物流信息
    if (['1'].includes(String(dataPage.detail.afterSaleType))) {
      queryLogisticsInfo()
    }
  })
}
/**
 * 物流信息
 */
const queryLogisticsInfo = () => {
  const { afterSaleNo }: any = route.query
  after_order_api.A_queryTrackInfo({ afterSaleNo }).then((res: any) => {
    dataPage.detail.orderDeliverVOList = res
  })
}


//售后类型
const afterSaleTypeName = computed(() => {
  return order_enum.getAfterSalesTypeTitle(dataPage.detail.afterSaleType + '')
})
//售后状态
const statusName = computed(() => {
  return order_enum.getAfter_order_statesTitle(dataPage.detail.status + '')
})

//文案类型
provide('afterSaleTypeName', afterSaleTypeName)
provide('statusName', statusName)

const openHandler = () => {
  dataPage.showReasonFlag = true
}
const closeHandler = () => {
  dataPage.showReasonFlag = false
}
</script>

<template>
  <div class="after_detail_container">
    <CardModel :title="`${afterSaleTypeName || ''}详情`">
      <OrderStateNode></OrderStateNode>
    </CardModel>
    <CardModel iconName="menu-order" :title="`售后状态:${statusName}`">
      <template v-if="['2', '3'].includes(String(dataPage.detail.status))" #option>
        <el-button type="danger" text="danger" @click="openHandler">查看原因</el-button>
      </template>
      <OrderInfoCell :orderInfo="dataPage.detail"></OrderInfoCell>
    </CardModel>
    <CardModel title="售后信息">
      <OrderProductCell :orderInfo="dataPage.detail"></OrderProductCell>
    </CardModel>
    <!-- 换货，退货 上门取件 -->
    <CardModel v-if="['1', '4'].includes(String(dataPage.detail.afterSaleType))" title="仓库地址信息">
      <OrderReturnInfo :receiveUserInfo="dataPage.detail.receiveUserInfo"></OrderReturnInfo>
    </CardModel>
    <!-- 退货 -->
    <CardModel
      v-if="['1', '4'].includes(String(dataPage.detail.afterSaleType)) && dataPage.detail?.receiveUserInfo?.expressCode"
      title="退货物流">
      <OrderReturnLogistic :receiveUserInfo="dataPage.detail.receiveUserInfo"></OrderReturnLogistic>
    </CardModel>
    <!-- 换货， -->
    <CardModel v-if="['1'].includes(String(dataPage.detail.afterSaleType))" title="客户地址信息">
      <OrderReturnUserInfo :sendUserInfo="dataPage.detail.sendUserInfo"></OrderReturnUserInfo>
    </CardModel>
    <!-- 换货 -->
    <template v-if="['1'].includes(String(dataPage.detail.afterSaleType))">
      <OrderLogisticCell :orderInfo="dataPage.detail" :orderDeliverVOList="dataPage.detail.orderDeliverVOList">
      </OrderLogisticCell>
    </template>
    <!--取消原因-->
    <el-dialog v-model="dataPage.showReasonFlag" :title="dataPage.detail.status == '3' ? '取消原因' : '拒绝原因'" width="400px"
      draggable destroy-on-close :close-on-click-modal="false" @closed="closeHandler">
      <div class="option">
        <div class="flex mb-8">
          <span class="w-100 text-right mr-4 desc_box">
            {{
              dataPage.detail.status == '3' ? '取消原因' : '拒绝原因'
            }}:
          </span>
          <span>
            {{
              dataPage.detail.status == '3' ? dataPage.detail.cancelReason : dataPage.detail.rejectReason
            }}
          </span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="closeHandler">知道了</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.after_detail_container {
  position: relative;
  height: calc(100vh - 110px);
  overflow: auto;

  .audit_container {
    position: sticky;
    top: 0;
    left: 0;
    background-color: var(--el-searchForm-bg-color);
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 2px;
    border: 1px solid #e4e7ed;
    z-index: 999;
  }

  .desc_box {
    flex-shrink: 0;
  }
}
</style>