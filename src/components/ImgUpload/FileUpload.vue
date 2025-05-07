
  
<script setup lang="ts">
defineOptions({
  name: 'FileUpload'
})
import { UploadFilled } from '@element-plus/icons-vue'
import { A_upload } from '@/api/proudectManger'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getLocal } from '@/utils/storage'
import { getFileType } from '@/utils/upload'

const VITE_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
const headersToken = getLocal(VITE_TOKEN_KEY)

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  fileId: {
    type: String,
    default: ''
  },
  fileListModel: {
    type: Array,
    default: []
  },
  limit: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxSize: {
    type: Number,
    default: 5
  },
  acceptList: {
    type: Array,
    default: ['xls', 'xlsx']
  }
})
const emit = defineEmits(['update:modelValue', 'verify', 'update:fileId', 'update:file', 'update:fileListModel'])

const DEFAULT_ACCEPT = ref([
  'doc',
  'xls',
  'ppt',
  'docx',
  'xlsx',
  'pptx',
  'rar',
  'zip',
  'txt',
  'dwg',
  'dxf',
  'dwt',
  'pdf',
  'bmp',
  'png',
  'jpeg',
  'jpg',
  'aiff',
  'au',
  'mid',
  'midi',
  'mp3',
  'mp4',
  'wav',
  'wma',
  'm4a'
])
const upload = ref()

const headersData = computed(() => {
  return {
    Authorization: headersToken
  }
})

const fileList = computed({
  get() {
    return props.fileListModel || []
  },
  set(val) {
    emit('update:fileListModel', val)
  }
})

const actualAcceptList: any = computed(() => {
  return props.acceptList ? props.acceptList.map((item: any) => item.toLowerCase()) : DEFAULT_ACCEPT.value
})
const accept: any = computed(() => {
  return actualAcceptList.value.map((item: any) => `.${item}`).join(',')
})
const handleRemove: UploadProps['onRemove'] = (uploadFiles: any) => {
  emit('update:fileListModel', [])
  emit('update:fileId', '')
  emit('update:file', null)
}

const uploadSectionFile = (param: any) => {
  var fileObj = param.file
  A_upload(fileObj)
    .then((res: any) => {
      handleSuccess(res, param)
    })
    .catch((err: any) => {
      param.onError(err)
    })
}

const handleExceed = () => {
  ElMessage.warning(`最多只能上传${props.limit}个文件`)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  const { name, size } = rawFile
  const type = getFileType(name)
  const { maxSize } = props
  if (!actualAcceptList.value.includes(type)) {
    ElMessage.error(`文件【${name}】格式不支持`)
    return false
  }
  if (maxSize > 0 && size / 1024 / 1024 > maxSize) {
    ElMessage.warning(`文件【${name}】超出${maxSize}M限制`)
    return false
  }
}

const handleSuccess = (response: any, param: any) => {
  emit('update:fileId', response?.[0].id)
  emit('update:file', param.file)
  emit('verify')
}
</script>

<template>
  <div class="upload-demo">
    <el-upload
      ref="upload"
      v-bind="$attrs"
      :disabled="disabled"
      v-model:file-list="fileList"
      :http-request="uploadSectionFile"
      :on-remove="handleRemove"
      :limit="limit"
      :accept="accept"
      multiple
      :on-exceed="handleExceed"
      :before-upload="beforeAvatarUpload"
      action="/gateway-v2/backend-v2/system/oss/upload"
      :headers="headersData"
      name="file"
      drag
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">点击或拖拽文件到这里上传</div>
    </el-upload>
  </div>
</template>
<style lang="scss" scoped>
.upload-demo {
  :v-deep(.el-upload-dragger) {
    padding: 30px !important;
  }
}
</style>