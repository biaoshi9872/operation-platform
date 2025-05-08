<!--
 * @Descripttion: 文件上传组件
 * @version: 
 * @Author: biao.shi
 * @Date: 2022-06-13 18:54:45
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-21 09:25:27
-->
<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
defineOptions({
  name: 'Upload'
})
import files_api from '@/api/files'
import { getImgFileWidthAndHeight, getFileType } from '@/utils/upload'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getLocal } from '@/utils/storage'
import { isNullOrUnDefOrisEmpty } from '@/utils/is'
//

const VITE_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
const headersToken = getLocal(VITE_TOKEN_KEY)

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  isArray: {
    type: Boolean,
    default: true
  },
  limit: {
    type: Number,
    default: 5
  },
  maxWidth: {
    type: Number,
    default: 0 // 0 表示不限制 下同
  },
  maxHeight: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxSize: {
    // 最大尺寸单位 k
    type: Number,
    default: 1 * 1024
  },
  acceptList: {
    // 区分 accept 属性，accept 原生属性控制挑选文件时哪些文件类型可见
    type: Array,
    default: undefined
  },
  tip: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'verify'])

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

const fileList: any = computed({
  get() {
    //格式
    let urlValue = [] as any
    if (props.isArray) {
      urlValue = props.modelValue
    } else {
      urlValue = isNullOrUnDefOrisEmpty(props.modelValue) ? [] : props.modelValue?.split(',')
    }
    //转换
    if (urlValue?.length > 0) {
      return [
        ...urlValue.map((item: any) => {
          return { url: item }
        })
      ]
    } else {
      return []
    }
  },
  set(val) {
    let imgs: any = ''
    if (props.isArray) {
      imgs = val.map((item: any) => item.url)
    } else {
      imgs = val.map((item: any) => item.url).join(',')
    }
    emit('update:modelValue', imgs)
  }
})

const hideUpload = computed(() => {
  return fileList.value.length >= props.limit || props.disabled
})

const actualAcceptList: any = computed(() => {
  return props.acceptList ? props.acceptList.map((item: any) => item.toLowerCase()) : DEFAULT_ACCEPT.value
})
const accept: any = computed(() => {
  return actualAcceptList.value.map((item: any) => `.${item}`).join(',')
})
const exceeded: any = computed(() => {
  return fileList.value.length >= props.limit
})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFiles: any) => {
  fileList.value = uploadFiles
}

const handleRemoveHandler = (file: any) => {
  const arr = fileList.value
  fileList.value.splice(
    fileList.value.indexOf((el: any) => el.url == file.url),
    1
  )
  fileList.value = arr
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile: any) => {
  if (uploadFile.url.includes('.pdf')) {
    const a = document.createElement('a')
    a.style.display = 'none'
    a.setAttribute('href', uploadFile.url)
    a.setAttribute('target', '_blank')
    a.click()
  } else {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
  }
}

const uploadSectionFile = (param: any) => {
  var file = param.file
  files_api.A_upload({file})
    .then((res: any) => {
      handleSuccess(res)
    })
    .catch((err: any) => {
      param.onError(err)
    })
}

const downHandler = (file: any) => {
  // 创建a标签
  const down = document.createElement('a')
  // 文件名没传，则使用时间戳
  down.download = new Date().getTime().toString()
  // 隐藏a标签
  down.style.display = 'none'
  down.href = file.url
  // 模拟点击下载
  document.body.appendChild(down)
  down.click()
  // 释放URL
  URL.revokeObjectURL(down.href)
}

const handleExceed = () => {
  ElMessage.warning(`最多只能上传${props.limit}个文件`)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  const { name, size } = rawFile
  const type = getFileType(name)
  const { maxWidth, maxHeight, maxSize } = props
  if (!actualAcceptList.value.includes(type)) {
    ElMessage.error(`文件【${name}】格式不支持`)
    return false
  }
  if (maxSize > 0 && size / 1024 / 1024 > maxSize) {
    ElMessage.warning(`文件【${name}】超出${maxSize}M限制`)
    return false
  }
  if (maxWidth || maxHeight) {
    getImgFileWidthAndHeight(rawFile).then(({ width, height }: any) => {
      if (maxWidth > 0 && width > maxWidth) {
        ElMessage.warning(`图片【${name}】宽度超出${maxWidth}像素限制`)
        return false
      }
      if (maxHeight > 0 && height > maxHeight) {
        ElMessage.warning(`图片【${name}】高度超出${maxHeight}像素限制`)
        return false
      }
      return true
    })
  } else {
    return true
  }
}

const handleSuccess = (response: any) => {
  let ossUrl = response?.[0]?.ossUrl
  let arr = fileList.value || []
  arr.push({
    url: ossUrl
  })
  fileList.value = arr
  console.log(fileList.value, 'fileList')
  emit('verify')
}

const fileUrl = computed(() => {
  return function(item: any) {
    console.log(item, 'item')
    return item?.url?.endsWith('.pdf')
      ? 'https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20240110/5d4916c08d454b0ba9ce9c6c08cb1257.png'
      : item.url
  }
})
</script>
<template>
  <div :class="['multiple-upload', { 'multiple-upload_exceeded': exceeded }]">
    <el-upload
      ref="upload"
      v-bind="$attrs"
      :class="{ hide: hideUpload }"
      :disabled="disabled"
      :file-list="fileList"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
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
    >
      <template #tip>
        <Auxiliary :title="tip"></Auxiliary>
      </template>
      <template #file="file">
        <div class="file_contain">
          <img :src="fileUrl(file.file)" />
          <div class="status-label">
            <svg-icon name="upload_complete" class="upload_svg"></svg-icon>
          </div>
          <div class="file_option">
            <div class="file_content">
              <svg-icon name="magnify" @click="handlePictureCardPreview(file.file)"></svg-icon>
              <svg-icon v-if="!disabled" name="delete" @click="handleRemoveHandler(file.file)"></svg-icon>
            </div>
          </div>
        </div>
      </template>
      <slot name="uploadOption">
        <div v-if="limit > 1" class="upload_container">
          <svg-icon name="upload" class="fs-30"></svg-icon>
          <span>添加图片</span>
          <span>({{ fileList.length }}/{{ limit }})</span>
        </div>
        <el-icon v-else>
          <Plus />
        </el-icon>
      </slot>
    </el-upload>
    <!-- 实现预览 -->
    <el-dialog v-model="dialogVisible" draggable>
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.multiple-upload {
  ::v-deep(.el-upload-list) {
    .el-upload-list__item {
      width: 80px;
      height: 80px;
    }

    .el-upload--picture-card {
      width: 80px;
      height: 80px;
    }
  }

  .hide ::v-deep(.el-upload--picture-card) {
    display: none;
  }

  ::v-deep(.el-upload-list__item) {
    transition: none !important;
  }

  .file_contain {
    width: 100%;
    height: 100%;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .file_option {
    background-color: rgba(#000000, 0.1);
    transition: opacity var(--el-transition-duration);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;

    .file_content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 24px;
    }
  }

  .file_contain:hover {
    .file_option {
      display: inline-block;
    }
  }

  .status-label {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: var(--el-color-success);
    text-align: center;
    transform: rotate(45deg);

    .upload_svg {
      transform: rotate(-45deg);
      color: #fff;
    }
  }

  .upload_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 20px;
    color: var(--el-color-primary);
  }
}
</style>
