<script setup lang="ts">
interface IProp {
  orderBaseInfo: any
}
import isStateCheckHooks from '@/hooks/isStateCheckHooks';
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
const props = withDefaults(defineProps<IProp>(), {
  orderBaseInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const FIELDS = computed(() => {
  let arr = []

  if ([10, 101, 20, 201].includes(getSystemOptionType.value)) {
    arr.push({
      label: '订单编号',
      prop: 'orderNo'
    })
  }
  arr.push({
    label: getSystemOptionType.value == 401 ? '订单编号' : '渠道订单编号',
    prop: 'channelOrderNo'
  })
  arr.push({
    label: '提交订单时间',
    prop: 'submitTime'
  })
  arr.push({
    label: '确认下单时间',
    prop: 'confirmTime'
  })
  arr.push({
    label: '下单人',
    prop: 'buyer'
  })
  arr.push({
    label: '下单人手机号',
    prop: 'buyerPhone'
  })
  return arr
})

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
