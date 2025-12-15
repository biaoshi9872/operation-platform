<script setup lang="ts">
defineOptions({ name: 'CardModel' })

interface IProp {
  title: string
  iconName: string
  type: 'warning' | 'info' | 'success' | 'error'
}
const props = withDefaults(defineProps<IProp>(), {
  title: '',
  iconName: ''
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
  <el-card class="mb-8">
    <h3>
      <svg-icon v-if="iconName" :name="iconName" class="mr-4 fs-20" />
      <span class="title">{{ title }}</span>
      <span class="ml-8">
        <slot name="option"></slot>
      </span>
    </h3>
    <div class="pt-8">
      <slot></slot>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.title {
  color: v-bind(color);
}
</style>
