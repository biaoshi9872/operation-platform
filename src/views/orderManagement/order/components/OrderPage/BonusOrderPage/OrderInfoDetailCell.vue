<script setup lang="ts">
interface IProp {
  orderBaseInfo: any
  orderInfo: any
}

const props = withDefaults(defineProps<IProp>(), {
  orderBaseInfo: {},
  orderInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const goodDetail = computed(() => {
  return props.orderInfo.goodsInfo[0] || {}
})

const receiverInfo = computed(()=>{
  return props.orderInfo.receiverInfo
})

</script>

<template>
  <div class="content_box">
    <div class="item flex">
      <span class="item_title">商品名称:</span>
      <span class="item_value">
        {{ goodDetail.skuName || '-' }}
      </span>
    </div>
    <div class="item flex">
      <span class="item_title">商品分类:</span>
      <span class="item_value"> {{ goodDetail.ljj_couponType || '-' }}</span>
    </div>
    <div class="item flex">
      <span class="item_title">立减金平台:</span>
      <span class="item_value"> {{ goodDetail.ljj_platform || '-' }}</span>
    </div>
    <div class="item flex">
      <span class="item_title">批次有效期:</span>
      <span class="item_value"> {{ goodDetail.ljj_expireDateMin ?
        `${goodDetail.ljj_expireDateMin} ~ ${goodDetail.ljj_expireDateMax}` : '-' }}</span>
    </div>
    <div class="item flex">
      <span class="item_title">批次号:</span>
      <span class="item_value"> {{ goodDetail.thirdBatchNo || '-' }}</span>
    </div>
    <div class="item flex">
      <span class="item_title">领取账号:</span>
      <span class="item_value"> {{ receiverInfo.receiverPhone || '-' }}</span>
    </div>
    <div class="item flex">
      <span class="item_title">券ID:</span>
      <span class="item_value"> {{ goodDetail.thirdCouponId || '-' }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(4);
}
</style>
