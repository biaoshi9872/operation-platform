<script setup lang="ts">
import { downloadExcel } from '@/utils/upload'
import type { UploadInstance, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { assign } from 'lodash-es'
import { useRoute } from 'vue-router'
const $useRoue = useRoute()
interface IProp {
  exportNodeDecListConfig: any
  exportConfig: any
  exportApiConfig: any
  step: number,
  nextCallback: any,
  resultDetail: any
}
const props = withDefaults(defineProps<IProp>(), {
  exportNodeDecListConfig: {
    upLoadingDesc: {},
    downLoadingDesc: {}
  },
  exportConfig: {},
  resultDetail: {},
  exportApiConfig: {},
})
const emits = defineEmits<{
  (e: 'update:step', value: any): void
}>()

const fileList = ref(null)
const showError = ref(false)
const errorList = ref([])

//下载
const downHandler = () => {
  downloadExcel(props.exportConfig.url, props.exportConfig.exportName)
}

//上传
const uploadHandler = async () => {
  if (!props.exportApiConfig.api) {
    throw new Error('请添加导入接口')
  }
  //开始导入
  emits('update:step', 2)
  const file: any = fileList?.value?.raw
  const { source: type, ...query } = $useRoue.query
  try {
    const res = await props.exportApiConfig.api({ file, ...query, type })
    if (res?.errList?.length) {
      showError.value = true
      errorList.value = res?.errList || []
      emits('update:step', 1)
      return
    }
    assign(props.resultDetail, res,)
    emits('update:step', 3)
  } catch (error) {
    emits('update:step', 1)
  }
}

const upload = ref<UploadInstance>()

const changeHandler = (uploadFile: any, uploadFiles: any) => {
  fileList.value = uploadFile
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  const { name, size } = rawFile
  const maxSize = props.exportNodeDecListConfig?.maxSize || 10
  if (maxSize > 0 && size / 1024 / 1024 > maxSize) {
    ElMessage.warning(`文件【${name}】超出${maxSize}M限制`)
    return false
  }
  else {
    return true
  }
}
const removeHandler = () => {
  fileList.value = null
}

</script>
<template>
  <div class="upload_content">
    <!-- 下载模版 -->
    <div class="item_container">
      <div class="icon">
        <svg-icon name="download" />
      </div>
      <div class="content">
        <h3>{{ exportNodeDecListConfig.upLoadingDesc.title }}</h3>
        <div>{{ exportNodeDecListConfig.upLoadingDesc.desc }}</div>
        <el-button type="text" @click="downHandler">下载模版</el-button>
      </div>
    </div>
    <!-- 上传模版 -->
    <div class="item_container mt-16">
      <div class="icon">
        <svg-icon name="shangchuan" />
      </div>
      <div class="content">
        <h3>{{ exportNodeDecListConfig.downLoadingDesc.title }}</h3>
        <div>{{ exportNodeDecListConfig.downLoadingDesc.desc }}</div>
        <el-upload ref="upload" v-model="fileList" action="#" :limit="1" accept="'.xls, .xlsx"
          :on-change="changeHandler" :on-remove="removeHandler" :auto-upload="false"
          :before-upload="beforeAvatarUpload">
          <template v-if="!fileList" #trigger>
            <el-button type="text">点击上传</el-button>
          </template>
        </el-upload>
      </div>
    </div>
    <div class="mt-16 flex flex-center">
      <el-button type="primary" :disabled="!fileList" @click="uploadHandler">{{ exportNodeDecListConfig.nextTitle
        }}</el-button>
    </div>
  </div>
  <ErrorMsg v-model="showError" :dataList="errorList"></ErrorMsg>
</template>


<style lang="scss" scoped>
.upload_content {
  .item_container {
    border: 1px solid #e5e5e5;
    display: flex;

    .icon {
      font-size: 40px;
      margin-right: 8px;
      padding: 0 20px;
      background-color: #f5f7fa;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .content {
      padding: 10px 20px;
    }
  }
}
</style>
