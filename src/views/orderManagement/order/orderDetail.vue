<script setup lang="ts">
import OrderStateNode from './components/OrderStateNode.vue'
import OrderInfoCell from './components/OrderInfoCell.vue'
import OrderProductCell from './components/OrderProductCell.vue'
import OrderLogisticCell from './components/OrderLogisticCell.vue'
import order_enum from '@/utils/constant/order'
//import { A_getOrderDetail } from '@/api/orderManger'
import { useRoute } from 'vue-router'
// import { ORDERSTATUS, DELIVERSTAUS, AFTERSALESTATUS, getDictNameByKey } from '@/utils/constant'
const route = useRoute()
const showReasonFlag = ref(false)
const closeHandler = () => {
  showReasonFlag.value = false
}
const dataPage = reactive({
  detailInfo: {
    receiverName: '',
    receiverPhone: '',
    address: '',
    remarks: '',
    cancelReason: '',
    cancelTime: '',
    financeVOList: [], //财务信息
    goodsVOList: [], //商品信息
    orderDeliverExpressList: [], //物流信息
    provinceId: '',
    cityId: '',
    countyId: '',
    townId: '',
    orderStatus: '',
    cancelLogList: [],
    supplyErp: ''
  },
  activeName: 1
})

onMounted(() => {
  init()
})

const init = () => {
  getOrderDetail()
}

const getOrderDetail = () => {
  const { orderNo } = route.query
  // A_getOrderDetail(orderNo).then((res: any) => {
  //   dataPage.detailInfo = {
  //     ...dataPage.detailInfo,
  //     ...res
  //   }
  //   dataPage.activeName = 0
  // })
}

const isERPOrder = computed(() => {
  if (dataPage.detailInfo?.supplyErp && dataPage.detailInfo.supplyErp !== 'NONE') {
    return true
  }
  return false
})

//刷新
provide('searchQueryHandler', init)

const stateTitle = computed(() => {
  return order_enum.getDictNameByKey(order_enum.order_states, dataPage.detailInfo.orderStatus)
})
</script>

<template>
  <CardModel title="订单详情">
    <OrderStateNode></OrderStateNode>
  </CardModel>
  <CardModel iconName="menu-order" :title="`订单状态:${stateTitle}`">
    <template v-if="dataPage.detailInfo.cancelLogList.length || ['4'].includes(String(dataPage.detailInfo.orderStatus))" #option>
      <el-button @click="showReasonFlag = true" link type="danger">查看用户取消原因</el-button>
    </template>
    <OrderInfoCell :orderInfo="dataPage.detailInfo"></OrderInfoCell>
  </CardModel>
  <CardModel title="收货信息">
    <div class="content_box">
      <div class="item">
        <span class="item_title">收货人:</span>
        <span class="item_value">{{ dataPage.detailInfo.receiverName }}</span>
      </div>
      <div class="item">
        <span class="item_title">收货人手机号:</span>
        <span class="item_value">{{ dataPage.detailInfo.receiverPhone }}</span>
      </div>
      <div class="item">
        <span class="item_title">收货地址:</span>
        <span class="item_value">
          <AddressInfo
            :address="dataPage.detailInfo.address"
            :provinceId="dataPage.detailInfo.provinceId"
            :cityId="dataPage.detailInfo.cityId"
            :countyId="dataPage.detailInfo.countyId"
            :townId="dataPage.detailInfo.townId"
          ></AddressInfo>
        </span>
      </div>
    </div>
  </CardModel>
  <CardModel title="备注信息">
    <div class="content_box">
      <div class="item">
        <span class="item_title">订单备注:</span>
        <span class="item_value">{{ dataPage.detailInfo.remarks }}</span>
      </div>
    </div>
  </CardModel>

  <CardModel title="商品信息">
    <OrderProductCell
      :orderInfo="dataPage.detailInfo"
      :goodsVOList="dataPage.detailInfo.goodsVOList"
      :financeVOList="dataPage.detailInfo.financeVOList"
    ></OrderProductCell>
  </CardModel>
  <CardModel title="发货信息">
    <OrderLogisticCell
      v-model:active="dataPage.activeName"
      :orderInfo="dataPage.detailInfo"
      :orderDeliverVOList="dataPage.detailInfo.orderDeliverExpressList"
    ></OrderLogisticCell>
  </CardModel>
  <!--取消原因-->
  <el-dialog
    v-model="showReasonFlag"
    title="取消原因"
    width="500px"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @closed="closeHandler"
  >
    <el-table :data="dataPage.detailInfo.cancelLogList">
      <YbtTableColumn label="操作人" prop="userName" />
      <YbtTableColumn label="时间" prop="createTime" />
      <YbtTableColumn label="原因" prop="reason" />
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="closeHandler">知道了</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}
</style>
