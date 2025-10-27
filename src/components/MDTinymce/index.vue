<template>
    <div class="editor-container">
        <!-- 引入编辑器，绑定 imgAdd 事件 -->
        <mavon-editor v-model="content" :subfield="true" :toolbars="toolbars" @imgAdd="handleImgAdd" ref="editorRef" />
    </div>
</template>

<script setup>
defineOptions({
    name: 'MDTinymce'
})
import files_api from '@/api/files'
import { ref } from 'vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 用于发送上传请求（需安装 axios）
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:modelValue'])
const content = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
const editorRef = ref(null)
// 工具栏配置（确保开启 image 功能）
const toolbars = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    fullscreen: true, // 全屏编辑
    readmodel: true, // 沉浸式阅读
    htmlcode: true, // 展示html源码
    /* 1.3.5 */
    undo: true, // 上一步
    redo: true, // 下一步
    trash: true, // 清空
    save: true, // 保存（触发events中的save事件）
    /* 1.4.2 */
    navigation: true, // 导航目录
    /* 2.1.8 */
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    /* 2.2.1 */
    subfield: true, // 单双栏模式
    preview: true, // 预览

}

// 图片上传处理函数
const handleImgAdd = async (pos, file) => {
    // pos：图片插入的位置标识（用于后续替换）
    // file：选中的图片文件对象

    // 1. 构造 FormData（后端通常要求这种格式）
    const formData = new FormData()
    formData.append('file', file)  // 'file' 需与后端接口的参数名一致

    try {
        files_api.A_upload({ file })
            .then((res) => {
                const url = res?.[0].ossUrl
                const fileName = res?.[0].fileName
                debugger
                editorRef.value.$img2Url(pos, url)
            })
            .catch()

    } catch (error) {
        console.error('上传接口出错：', error)
    }
}
</script>

<style scoped>
.editor-container {
    width: 100%;
}
</style>