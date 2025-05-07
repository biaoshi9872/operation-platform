<script setup lang="ts">
interface IProp {
  dataList: any
  errorMsgInfo: any
  title: string
}
const props = withDefaults(defineProps<IProp>(), {
  dataList: [],
  title: '结果详情',
  errorMsgInfo: {
    key1: {
      prop: 'rowNum',
      label: '错误行号',
      width: '100'
    },
    key2: {
      prop: 'errorMsg',
      label: '错误信息'
    }
  }
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const handleReset = () => {
  emits('update:modelValue', false)
}
const handleClose = () => {
  handleReset()
}
</script>
<template>
  <el-dialog
    v-bind="$attrs"
    :title="title "
    width="500px"
    append-to-body
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @closed="handleReset"
  >
    <div class="option">
      <el-table :data="dataList" border max-height="400">
        <el-table-column
          :prop="props.errorMsgInfo.key1.prop"
          :width="props.errorMsgInfo.key1?.width || 100"
          :label="props.errorMsgInfo.key1.label"
        ></el-table-column>
        <el-table-column :prop="props.errorMsgInfo.key2.prop" :label="props.errorMsgInfo.key2.label" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="mr-10">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>