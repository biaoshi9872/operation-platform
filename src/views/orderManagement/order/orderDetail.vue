<script setup lang="ts">
import order_api from '@/api/order'
import order_enum from '@/utils/constant/order'
import { useRoute } from 'vue-router'
import OrderInfoCell from './components/OrderInfoCell.vue'
import OrderLogisticCell from './components/OrderLogisticCell.vue'
import OrderProductCell from './components/OrderProductCell.vue'
import OrderStateNode from './components/OrderStateNode.vue'
const route = useRoute()
const showReasonFlag = ref(false)
const closeHandler = () => {
  showReasonFlag.value = false
}
const dataPage = reactive({
  detailInfo: {
    goodsInfo: [],
    receiverInfo: {},
    orderBaseInfo: {},
    freightAmount: null,
    remark: '',
    orderStatus: null,
    orderDeliverExpressList: []
  },
  activeName: 1
})

onMounted(() => {
  init()
})

const init = () => {
  getOrderDetail()

}

const getOrderLogistic = () => {
  const { channelOrderNo } = dataPage.detailInfo.orderBaseInfo as any
  order_api.A_orderQueryTrace({ channelOrderNo }).then((res: any) => {
    dataPage.detailInfo.orderDeliverExpressList = res || []
  })
}
const getOrderDetail = () => {
  const { channelOrderNo } = route.query
  order_api.A_getDetail({ channelOrderNo }).then((res: any) => {
    dataPage.detailInfo = {
      ...dataPage.detailInfo,
      ...res
    }
    dataPage.activeName = 0
    getOrderLogistic()
  })
}

//刷新
provide('searchQueryHandler', init)

const stateTitle = computed(() => {
  return order_enum.getOrder_statesTitle(dataPage.detailInfo.orderBaseInfo.orderStatus)
})
</script>

<template>
  <CardModel title="订单详情">
    <OrderStateNode></OrderStateNode>
  </CardModel>
  <CardModel iconName="menu-order" :title="`订单状态:${stateTitle}`">
    <OrderInfoCell :orderBaseInfo="dataPage.detailInfo.orderBaseInfo"></OrderInfoCell>
  </CardModel>
  <CardModel title="收货信息">
    <div class="content_box">
      <div class="item">
        <span class="item_title">收货人:</span>
        <span class="item_value">{{ dataPage.detailInfo.receiverInfo.receiverName }}</span>
      </div>
      <div class="item">
        <span class="item_title">收货人手机号:</span>
        <span class="item_value">{{ dataPage.detailInfo.receiverInfo.receiverPhone }}</span>
      </div>
      <div class="item">
        <span class="item_title">收货地址:</span>
        <span class="item_value">
          {{ dataPage.detailInfo.receiverInfo.address }}
        </span>
      </div>
    </div>
  </CardModel>
  <CardModel title="备注信息">
    <div class="content_box">
      <div class="item">
        <span class="item_title">订单备注:</span>
        <span class="item_value">{{ dataPage.detailInfo.remark }}</span>
      </div>
    </div>
  </CardModel>
  <CardModel title="商品信息">
    <OrderProductCell :orderInfo="dataPage.detailInfo" :goodsVOList="dataPage.detailInfo.goodsInfo"></OrderProductCell>
  </CardModel>
  <CardModel title="发货信息">
    <OrderLogisticCell v-model:active="dataPage.activeName" :orderInfo="dataPage.detailInfo"
      :orderDeliverVOList="dataPage.detailInfo.orderDeliverExpressList"></OrderLogisticCell>
  </CardModel>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}
</style>
