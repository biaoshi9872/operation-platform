<script setup lang="ts">
interface IProp {
  orderBaseInfo: any
  orderInfo: any
}
import isStateCheckHooks from '@/hooks/isStateCheckHooks';
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
const props = withDefaults(defineProps<IProp>(), {
  orderBaseInfo: {},
  orderInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()


</script>

<template>
  <div class="content_box">
    <div class="item flex">
      <span class="item_title">商品名称:</span>
      <span class="item_value"></span>
    </div>
    <div class="item flex">
      <span class="item_title">商品分类:</span>
      <span class="item_value"></span>
    </div>
    <div class="item flex">
      <span class="item_title">立减金平台:</span>
      <span class="item_value"></span>
    </div>
    <div class="item flex">
      <span class="item_title">批次有效期:</span>
      <span class="item_value"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(4);
}
</style>
