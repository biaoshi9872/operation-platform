<script setup lang="ts">
defineOptions({ name: 'TextLight' })
interface IProp {
  textContent: string
  searchValue: string
  showOverflowTooltip: boolean
}
const props = withDefaults(defineProps<IProp>(), {
  textContent: '',
  searchValue: '',
  showOverflowTooltip: false
})

const highlightedText = computed(() => {
  if (!props.searchValue) {
    return props.textContent
  }
  const regex = new RegExp(props.searchValue, 'g')
  return props.textContent.replace(regex, `<span style="background-color: #ff8936;">${props.searchValue}</span>`)
})
</script>
<template>
  <el-tooltip class="item" effect="dark" :content="textContent" :disabled="showOverflowTooltip" placement="top">
    <div class="text-light-box" v-html="highlightedText"></div>
  </el-tooltip>
</template>
<style lang="scss" scoped>
.text-light-box {
  @include overflow(1);
}
</style>