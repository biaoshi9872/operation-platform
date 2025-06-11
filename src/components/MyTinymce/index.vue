<template>
  <div class="timmy_container">
    <TinymcVue :id="state.editorId" v-model="state.content" :init="state.options" :disabled="props.disabled"
      @change="onChange"></TinymcVue>
    <input ref="uploadFileRef" style="display: none" type="file" multiple :accept="props.accept" name="file"
      @change="uploadChange" />
    <el-dialog v-model="dialogTableVisible" title="上传文件" width="300">
      <div class="flex justify-center items-center">
        <!-- <PictureInformation v-model="dataUrl" @callBack="changeHandler" :accept="['png', 'jpg', 'jpeg', 'bmp']" :limit="1"></PictureInformation> -->
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="MyTinymce">
// import PictureInformation from '../SelectModel/pictureInformation/index.vue'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

import TinymcVue from '@tinymce/tinymce-vue'
import tinymce from 'tinymce'
import 'tinymce/icons/default/icons'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
import 'tinymce/themes/silver/theme'

import files_api from '@/api/files'
import { getUUID } from '@/utils/tools'

const VITE_BASE_PATH = import.meta.env.VITE_BASE_PATH
const dialogVisible = ref(false)
const emit = defineEmits(['update:modelValue', 'verify', 'change'])

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: '.bmp,.png,.jpeg,.jpg'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 5
  },
  height: {
    type: Number,
    default: 650
  },
  placeholder: {
    type: String,
    default: '建议上传图片，图片大小不能超过5M,图片宽度750'
  },
  type: {
    type: String,
    default: ''
  }
})
const dataUrl = ref([''])
const dialogTableVisible = ref(false)
const uploadDialogRef = ref()
const uploadFileRef = ref(null)
//点击上传事件
const uploadFileClick = () => {
  //@ts-ignore
  uploadFileRef.value.click()
}

const checkFilesSize = (rawFile: any): boolean => {
  if (rawFile.size / 1024 / 1024 > props.size) {
    rawFile.status = 'exception'
    rawFile.msg = `文件大小不能超过${props.size}MB!`
    return false
  }
  return true
}

const state = reactive({
  editorId: getUUID(),
  content: props.modelValue,
  options: {
    language_url: `/${VITE_BASE_PATH}/tinymce/lange/zh_CN.js`,
    language: 'zh_CN',
    base_url: `/${VITE_BASE_PATH}/tinymce`,
    skin_url: `/${VITE_BASE_PATH}/tinymce/skins/ui/oxide`,
    content_css: `/${VITE_BASE_PATH}/tinymce/custom.css`,
    placeholder: props.placeholder,
    plugins:
      'paste print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern  autoresize',
    external_plugins: {
      customimage: '/vsupplier_admin/tinymce/plugins/customimage.js'
    },
    toolbar: [
      'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
        styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
        table customimage media charmap hr pagebreak insertdatetime print preview | fullscreen | lineheight'
    ],
    readonly: props.readonly,
    height: props.height,
    min_height: 400,
    max_height: props.height,
    fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
    font_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
    link_list: [],
    image_list: [],
    image_class_list: [
      {
        title: 'None',
        value: ''
      }
      // { title: 'Some class', value: 'class-name' }
    ],
    importcss_append: false,
    //自定义文件选择器的回调内容
    file_picker_callback(callback: any, value: any, meta: any) {
      console.log('file_picker_callback: ')
      var input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', '.jpg,.png,.jpeg')
      input.click()
      input.onchange = function () {
        const file = this.files[0]
        files_api.A_upload(file)
          .then((res: any) => {
            const url = res?.[0].ossUrl
            const fileName = res?.[0].fileName
            callback(url, {
              text: fileName
            })
          })
          .catch()
      }
    },
    images_upload_base_path: '',
    images_upload_handler: function (blobInfo: any, succFun: any, failFun: any) {
      const blob = blobInfo.blob()
      const file = new File([blob], '1.png', { type: blob.type })
      files_api.A_upload(file)
        .then((res: any) => {
          const url = res?.[0].ossUrl
          const fileName = res?.[0].fileName
          succFun(url)
        })
        .catch()
    },
    toolbar_sticky: false,
    autosave_ask_before_unload: false,
    customImageCallback() {
      dataUrl.value = ['']
      dialogTableVisible.value = true
      // uploadFileClick()
    },
    urlconverter_callback: function (url: any, node: any, on_save: any, name: any) {
      if (node === 'img' && url.startsWith('blob:')) {
        tinymce.activeEditor && tinymce.activeEditor.uploadImages()
      }
      return url
    },
    paste_preprocess: function (plugin: any, args: any) {
      console.log(args.content)
      args.content = 'helloworld'
    }
  }
})

//本地上传，素材库上传
const changeHandler = (val: any) => {
  const editor = tinymce.get(state.editorId) as any
  val.forEach((el: any) => {
    editor.insertContent(`<img src="${el.ossUrl}" alt="加载失败" style="max-width: 100%;height: auto;" />`)
  })
  dialogTableVisible.value = false
}

//原生上传事件
const uploadChange = (e: any) => {
  const chooseFiles = e.target.files
  for (let item of chooseFiles) {
    if (checkFilesSize(item)) {
      files_api.A_upload(item)
        .then((res: any) => {
          const url = res?.[0].ossUrl
          const fileName = res?.[0].fileName
          selectPic(url)
        })
        .catch()
    }
  }
  e.target.value = ''
}

watch(
  () => props.modelValue,
  newValue => {
    state.content = newValue
    if (props.readonly) {
      tinymce.get(state.editorId).setMode('readonly')
    } else {
      tinymce.get(state.editorId).setMode('design')
    }
  }
)

watch(
  () => state.content,
  newValue => {
    emit('update:modelValue', newValue)
    emit('change', newValue)
    emit('verify', newValue)
  }
)

const onChange = () => {
  // emit('change')
}

// 主动更新 content
const setContent = (value: any) => {
  tinymce.get(state.editorId).setContent(value)
}
const selectPic = (picFullUrl: any) => {
  const editor = tinymce.get(state.editorId) as any
  editor.insertContent(`<img src="${picFullUrl}" alt="加载失败" style="max-width: 100%;height: auto;" />`)
  dialogVisible.value = false
}

onMounted(() => {
  tinymce.init(state.options)
})

onBeforeUnmount(() => {
  const editor = tinymce.get(state.editorId)
  editor && editor.remove()
})

defineExpose({
  setContent
})
</script>

<style>
.tox-menu-nav__js.tox-collection__item[title='图片...'] {
  display: none;
}
</style>