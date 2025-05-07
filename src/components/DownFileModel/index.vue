<script setup lang="ts">
import { downloadExcel } from '@/utils/upload'
interface IProp {
  isDisable: boolean
  file: any
}
const props = withDefaults(defineProps<IProp>(), {
  isDisable: false,
  file: {
    fileUrl: '',
    fileName: ''
  }
})
const emits = defineEmits<{
  (e: 'delete'): void
}>()

const data = reactive({
  dialogVisible: false
})
//预览
const viewFileHandler = () => {
  data.dialogVisible = true
}

//下载
const downFileHandler = () => {
  downloadExcel(props.file.fileUrl || props.file.ossUrl, props.file.fileName)
}

//删除
const deleteHandler = () => {
  emits('delete')
}
</script>
<template>
  <div class="flex items-center">
    <img width="20" height="20" src="@/assets/images/link.png" class="mr-8" />
    <el-button type="text" @click="downFileHandler">{{ props.file.fileName }}</el-button>
    <el-button type="text" @click="downFileHandler">下载</el-button>
    <el-button type="text" @click="viewFileHandler">预览</el-button>
    <el-button type="text" v-if="!isDisable" @click="deleteHandler">删除</el-button>
    <OfficePreview v-model="data.dialogVisible" :ossFile="props.file"></OfficePreview>
  </div>
</template>
<style lang="scss" scoped></style>