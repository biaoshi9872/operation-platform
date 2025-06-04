<script setup lang="ts">
interface IProp {
  orderBaseInfo: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderBaseInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
const FIELDS = [
  {
    label: '订单号',
    prop: 'orderNo'
  },
  {
    label: '渠道订单编号',
    prop: 'channelOrderNo'
  },
  {
    label: '提交订单时间',
    prop: 'submitTime'
  },
  {
    label: '确认下单时间',
    prop: 'confirmTime'
  },
  {
    label: '下单人',
    prop: 'buyer'
  },
  {
    label: '下单人手机号',
    prop: 'buyerPhone'
  }
]

const getTitle = computed(() => {
  return function (find: any) {
    return props.orderBaseInfo[find.prop] || '-'
  }
})
</script>

<template>
  <div class="content_box">
    <div class="item flex" v-for="(item, index) in FIELDS" :key="index">
      <span class="item_title">{{ item.label }}:</span>
      <span class="item_value">{{ getTitle(item) || '-' }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(4);
}
</style>
