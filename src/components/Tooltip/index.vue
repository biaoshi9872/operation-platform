<script setup lang="ts">
defineOptions({ name: 'Tooltip' })
interface IProp {
  content: string
}
const props = withDefaults(defineProps<IProp>(), {
  content: ''
})
</script>
<template>
  <div class="flex items-center justify-start gap-2">
    <slot></slot>
    <el-tooltip effect="dark" :content="content" placement="top">
      <el-icon>
        <QuestionFilled />
      </el-icon>
    </el-tooltip>
  </div>
</template>
<style lang="scss" scoped>
</style>