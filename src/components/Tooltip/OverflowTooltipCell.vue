<script setup lang="ts">
defineOptions({ name: 'OverflowTooltipCell' })
interface IProp {
  text: string
  overflow: number
}
const props = withDefaults(defineProps<IProp>(), {
  text: '',
  overflow: 1
})
const tooltipRef = ref(null)
const attribute1TooltipShow = ref(false)
const checkEllipsis = (el: any, lineNum: number = 1) => {
  let lineHeight = getComputedStyle(el)?.lineHeight?.replaceAll('px', '') || (0 as any)
  let scrollHeight = el.scrollHeight
  return scrollHeight > lineHeight * lineNum
}
onMounted(() => {
  setTimeout(() => {
    attribute1TooltipShow.value = checkEllipsis(tooltipRef.value)
  }, 500)
})
</script>
<template>
  <el-tooltip :content="text" :disabled="!attribute1TooltipShow" placement="top">
    <div ref="tooltipRef" class="overflow-tooltip-cell">
      <slot></slot>
    </div>
  </el-tooltip>
</template>
<style lang="scss" scoped>
.overflow-tooltip-cell {
  $overFlowNum: v-bind(overflow);
  @include overflow($overFlowNum);
  ::v-deep(a) {
    text-decoration: underline !important;
    color: var(--el-color-primary);
  }
}
</style>