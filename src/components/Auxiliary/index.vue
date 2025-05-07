<script setup lang="ts">
defineOptions({ name: 'Auxiliary' })
interface IProp {
  title: string
  type: 'warning' | 'info' | 'success' | 'error'
}
const props = withDefaults(defineProps<IProp>(), {
  title: '',
  type: 'info'
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
const color = computed(() => {
  switch (props.type) {
    case 'warning':
      return '#ff9900'
    case 'info':
      return '#999'
    case 'success':
      return '#0099ff'
    case 'error':
      return '#ff0000'
    default:
      return '#999'
  }
})
</script>
<template>
  <span class="auxiliary">
    {{title}}
    <slot></slot>
  </span>
</template>
<style lang="scss" scoped>
.auxiliary {
  color: v-bind(color) !important;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>