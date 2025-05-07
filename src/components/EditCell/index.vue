<script setup lang="ts" name="EditCell">
defineOptions({
  name: 'EditCell'
})
import { Edit } from '@element-plus/icons-vue'

const prop = defineProps({
  value: {
    type: String,
    default: ''
  },
  authKey: {
    type: String,
    default: ''
  },
  info: {
    type: Object,
    default: () => {}
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const chickHandler = () => {
  prop.info.editState = !prop.info.editState
}

const authObj = computed(() => {
  return {
    authKey: prop.authKey,
    detail: prop.info
  }
})
</script>

<template>
  <div class="cell_coontainer">
    <slot v-if="prop.info?.editState"></slot>
    <span v-else>
      {{ value }}
      <slot name="content"></slot>
    </span>
    <span v-auth="authObj">
      <el-icon class="ml-4" @click="chickHandler">
        <Edit />
      </el-icon>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.cell_coontainer {
  height: 100%;
  width: 100%;
  min-width: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
