<script setup lang="ts">
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import AttributeModule from '../SkuDetail/AttributeModule.vue'

const { isCombinationGoods } = isStateCheckHooks()

interface IProp {
  goodDetail: any
}
const props = withDefaults(defineProps<IProp>(), {
  goodDetail: {}
})

const isShowAttr = computed(() => {
  if (props?.goodDetail?.hasOwnProperty('comboType')) {
    return isCombinationGoods(props?.goodDetail)
  } else {
    return false
  }
})
</script>
<template>
  <div v-if="isShowAttr">
    <div class="mb-16 flex justify-start">
      规格：
      <AttributeModule :row="props.goodDetail" comboSkuListFiled="comboDetailList"></AttributeModule>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
