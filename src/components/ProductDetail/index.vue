<script setup lang="ts">
import { computed } from 'vue'
import BaseProductDetail from './BaseProductDetail.vue'
import BonusProductDetail from './BonusProductDetail.vue'
import VirtualProductDetail from './VirtualProductDetail.vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  itemInfo: {
    type: Object,
    default: () => ({})
  },
  productSource: {
    type: String,
    default: ''
  },
  appId:{
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'api'
  },
})
const emits = defineEmits(['update:modelValue'])
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
    label: '新天猫超市',
    value: '63',
    component: BaseProductDetail
  },
  {
    label: '驿宝通精选',
    value: '104',
    component: BaseProductDetail
  },
  {
    label: '平台虚拟商品',
    value: '106',
    component: BaseProductDetail
  },
  {
    label: '数字权益礼包',
    value: '107',
    component: VirtualProductDetail
  },
  {
    label: '立减金',
    value: '108',
    component: BonusProductDetail
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

const productDetailRef = ref(null)
const openHandler = () => {
  productDetailRef.value?.openHandler?.()
}

defineExpose({
  productDetailRef,
  openHandler
})

</script>
<template>
  <component ref="productDetailRef" :is="currentComponent?.component" v-bind="currentComponent"
    :modelValue="modelValue" :itemInfo="itemInfo" :productSource="productSource":appId="appId" :type="type"
    @update:modelValue="emits('update:modelValue', $event)">
  </component>
</template>
<style lang="scss" scoped></style>
