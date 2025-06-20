<script setup lang="ts">
interface IProp {
  receiveUserInfo?: any
}
const props = withDefaults(defineProps<IProp>(), {
  receiveUserInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
</script>

<template>
  <div class="content_box">
    <div class="item">
      <span class="item_title">退货物流信息:</span>
      <span class="item_value">{{ receiveUserInfo.expressCompanyName }}</span>
    </div>
    <div class="item">
      <span class="item_title">物流单号:</span>
      <span class="item_value">{{ receiveUserInfo.expressCode }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}
</style>
