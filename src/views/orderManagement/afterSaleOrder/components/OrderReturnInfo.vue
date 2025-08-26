<script setup lang="ts">
const route = useRoute()
interface IProp {
  receiveUserInfo?: any
}
const props = withDefaults(defineProps<IProp>(), {
  receiveUserInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
const afterSaleTypeName = inject('afterSaleTypeName', () => '')

</script>

<template>
  <div class="content_box">
    <div class="item">
      <span class="item_title">联系人:</span>
      <span class="item_value">{{ receiveUserInfo?.name }}</span>
    </div>
    <div class="item">
      <span class="item_title">联系电话:</span>
      <span class="item_value">{{ receiveUserInfo?.mobile }}</span>
    </div>
    <div class="item">
      <span class="item_title">{{ afterSaleTypeName }}地址:</span>
      <span class="item_value">
        {{ receiveUserInfo?.address }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}
</style>
