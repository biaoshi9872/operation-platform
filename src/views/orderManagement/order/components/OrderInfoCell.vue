<script setup lang="ts">
interface IProp {
  orderInfo: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
const FIELDS = [
  // {
  //   label: '父订单号',
  //   prop: 'parentOrderNo'
  // },
  {
    label: '订单号',
    prop: 'orderNo'
  },
  {
    label: '渠道订单编号',
    prop: 'thirdOrderNo'
  },
  // {
  //   label: '电商订单编号',
  //   prop: 'outOrderNo'
  // },
  {
    label: '提交订单时间',
    prop: 'orderTime'
  },
  {
    label: '确认下单时间',
    prop: 'confirmTime'
  },
  {
    label: '申请取消时间',
    prop: 'cancelTime'
  },
  {
    label: '下单人',
    prop: 'buyer'
  },
  {
    label: '下单人手机号',
    prop: 'buyerPhone'
  }
  // {
  //   label: '分销渠道',
  //   prop: 'merchantName'
  // }
]

const getTitle = computed(() => {
  return function(find: any) {
    return props.orderInfo[find.prop] || '-'
  }
})
</script>

<template>
  <div class="content_box">
    <div class="item flex" v-for="(item, index) in FIELDS" :key="index">
      <span class="item_title">{{ item.label }}:</span>
      <span class="item_value">{{ getTitle(item) ||'-' }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(4);
}
</style>
