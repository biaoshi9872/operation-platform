<!--
 * @Descripttion:
 * @version:
 * @Author: biao.shi
 * @Date: 2022-10-24 19:41:53
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-15 11:08:28
-->
<!--  -->

<script lang="ts" name="ImportButton" setup>
defineOptions({ name: 'ImportButton' })
import { computed, reactive, ref } from 'vue'
import { getLocal, setLocal } from '@/utils/storage'
import type { UploadProps, TagProps } from 'element-plus'
import { ElMessage } from 'element-plus'
const VITE_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
const props = defineProps({
  importExcelApi: {
    type: String,
    default: '',
    require: true
  },
  param: {
    type: Object,
    default: () => {}
  },
  accept: {
    type: String,
    default: '.xls, .xlsx'
  }
})

const emits = defineEmits<{
  (e: 'callBack', value: any, score: any): void
}>()

const data = reactive({
  loading: false,
  fileList: []
})

const importExcelHeader = computed(() => {
  return {
    token: getLocal(VITE_TOKEN_KEY),
    Authorization: getLocal(VITE_TOKEN_KEY)
  }
})
const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
  emits('callBack', response, props?.param?.type || '')
  console.log(response, 'response')
  if (response.code != 0) {
    ElMessage.error(response.msg)
  }
  data.loading = false
}
const progressHandler = () => {
  data.loading = true
}
const errorHandler = () => {
  data.loading = false
}
</script>

<template>
  <div class="import_box">
    <el-upload
      ref="upload"
      :action="importExcelApi"
      :show-file-list="false"
      :headers="importExcelHeader"
      :data="{
      ...props.param
    }"
      :on-success="handleUploadSuccess"
      :on-progress="progressHandler"
      :on-error="errorHandler"
      auto-upload
    >
      <el-button v-bind="$attrs" :loading="data.loading">
        <slot></slot>
      </el-button>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
.import_box {
  display: inline-block;
  margin: 0 12px;
}
</style>
