<template>
  <el-dialog v-bind="$attrs" destroy-on-close :close-on-click-modal="false" :title="props.ossFile.fileName"
    @closed="handleClose" width="80%">
    <div>
      <vue-office-excel :src="props.ossFile.ossUrl || props.ossFile.fileUrl" style="height: 600px; width: 100%"
        @rendered="renderedHandler" @error="errorHandler" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="OfficePreview">
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/excel/lib/index.css'

const props = defineProps({
  ossFile: {
    type: Object,
    default: {
      ossUrl: '',
      fileName: ''
    }
  }
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const renderedHandler = () => {
  console.log('渲染完成')
}

const errorHandler = () => {
  console.log('渲染失败')
}

//关闭
const handleClose = () => {
  emits('update:modelValue', false)
}
</script>

<style lang="less" scoped></style>
