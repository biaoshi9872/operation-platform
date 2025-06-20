<script setup lang="ts">
const route = useRoute()

interface IProp {
  sendUserInfo?: any
}
const props = withDefaults(defineProps<IProp>(), {
  sendUserInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()


const afterSaleTypeName = inject('afterSaleTypeName', () => '')

// })
</script>

<template>
  <div class="content_box">
    <div class="item">
      <span class="item_title">联系人:</span>
      <span class="item_value">{{ sendUserInfo.name }}</span>
    </div>
    <div class="item">
      <span class="item_title">联系电话:</span>
      <span class="item_value">{{ sendUserInfo.mobile }}</span>
    </div>
    <div class="item">
      <span class="item_title">{{ afterSaleTypeName }}地址:</span>
      <span class="item_value">
        {{ sendUserInfo.address }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}
</style>
