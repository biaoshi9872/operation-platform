<script setup lang="ts">
import LogisticCell from '../../components/LogisticCell.vue'
// import { A_getOrderDeliverExpress } from '@/api/orderManger'

const route = useRoute()
interface IProp {
  orderInfo?: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const dataPage = reactive({
  orderDeliverVOList: []
})

onMounted(() => {
  getOrderReturnInfo()
})

const getOrderReturnInfo = () => {
  const { afterSaleOrderNo: orderNo } = route.query
  // A_getOrderDeliverExpress({ orderNo, type: 1 }).then((res: any) => {
  //   dataPage.orderDeliverVOList = res
  // })
}

const activeName = ref(0)
</script>

<template>
  <CardModel v-if="dataPage.orderDeliverVOList.length" title="供应商发货信息">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`包裹${index + 1}`" :name="index" v-for="(item, index) in dataPage.orderDeliverVOList">
          <LogisticCell :deliverInfo="item" :orderType="1"></LogisticCell>
        </el-tab-pane>
      </el-tabs>
    </div>
  </CardModel>
</template>

<style lang="scss" scoped></style>
