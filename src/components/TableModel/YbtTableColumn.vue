<script setup lang="ts">
defineOptions({ name: 'YbtTableColumn' })
interface IProp {
  prop: string
  type: string
}
const props = withDefaults(defineProps<IProp>(), {
  prop: ''
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const isFieldShow = inject(
  'isFieldShow',
  computed(() => {
    return function (key: string) {
      return true
    }
  })
)
</script>
<template>
  <el-table-column v-if="isFieldShow(prop)" v-bind="$attrs" :prop="prop">
    <template #default="scope">
      <slot name="default" v-bind="scope">{{scope.row[prop]}}</slot>
    </template>
    <template #header>
      <slot name="header"></slot>
    </template>
  </el-table-column>
</template>
<style lang="scss" scoped>
</style>