<script setup lang="ts">
interface IProp {
  row: any
}
const props = withDefaults(defineProps<IProp>(), {
  row: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
</script>
<template>
  <div>{{ row.receiverName }}</div>
  <div>{{ row.receiverPhone }}</div>
  <div class="tooltip">
    <el-tooltip effect="dark" :content="row.address" placement="top">
      <span>{{ row.address }}</span>
    </el-tooltip>
  </div>
</template>
<style lang="scss" scoped></style>