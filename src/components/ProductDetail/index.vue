<script setup lang="ts">
import { computed } from 'vue'
import BaseProductDetail from './BaseProductDetail.vue'
const props = defineProps({
  productSource: {
    type: String,
    default: ''
  }
})
const ProductDetailList = [
  {
    label: '京东',
    value: '1',
    component: BaseProductDetail
  },
  {
    label: '京东生鲜',
    value: '11',
    component: BaseProductDetail
  },
  {
    label: '天猫超市',
    value: '55',
    component: BaseProductDetail
  },
  {
    label: '驿宝通精选',
    value: '104',
    component: BaseProductDetail
  },
  {
    label: '渠道自营',
    value: '105',
    component: BaseProductDetail
  }
]
const currentComponent = computed(() => {
  return ProductDetailList.find(item => item.value == props.productSource)
})

</script>
<template>
  <component :is="currentComponent?.component" v-bind="currentComponent" :productSource="productSource"></component>
</template>
<style lang="scss" scoped></style>