<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { json } from '@codemirror/lang-json'
import { basicSetup } from 'codemirror'

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'error', value: string): void
}>()

const editorRef = ref<HTMLDivElement>()
let editorView: EditorView | null = null

// JSON 错误信息中文映射
const errorMessages: Record<string, string> = {
    'Expected property name or "}"': '需要属性名或 "}"',
    'Expected "," or "}"': '需要 "," 或 "}"',
    'Expected "," or "]"': '需要 "," 或 "]"',
    'Expected value': '需要一个值',
    'Expected property name': '需要属性名',
    'Unexpected end of input': '意外的输入结束',
    'Unexpected end of JSON input': 'JSON 意外结束',
    'Unexpected token': '意外的符号',
    'Invalid character': '无效的字符',
    'Duplicate key': '重复的键名',
    'Invalid number': '无效的数字',
    'Invalid string': '无效的字符串',
    'Invalid value': '无效的值'
}

// 转换错误信息为中文
const translateError = (error: string): string => {
    for (const [key, value] of Object.entries(errorMessages)) {
        if (error.includes(key)) {
            return value
        }
    }
    return error
}

const createEditor = () => {
    if (!editorRef.value) return

    try {
        const startState = EditorState.create({
            doc: props.modelValue || '',
            extensions: [
                basicSetup,
                json(),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        const value = update.state.doc.toString()
                        emit('update:modelValue', value)
                        try {
                            JSON.parse(value)
                            emit('error', '')
                        } catch (e) {
                            emit('error', translateError((e as Error).message))
                        }
                    }
                })
            ]
        })

        editorView = new EditorView({
            state: startState,
            parent: editorRef.value
        })
    } catch (error) {
        console.error('CodeMirror 初始化错误:', error)
    }
}
// watch(() => props.modelValue, (value) => {
//     if (editorView) {
//         createEditor()
//     }
// })

onMounted(() => {
    createEditor()
})

onBeforeUnmount(() => {
    editorView?.destroy()
})
</script>

<template>
    <div class="json-editor">
        <div ref="editorRef" class="editor-container"></div>
    </div>
</template>

<style scoped>
.json-editor {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}

.editor-container {
    min-height: 200px;
}

:deep(.cm-editor) {
    height: 100%;
    min-height: 200px;
}

:deep(.cm-editor.cm-focused) {
    outline: none;
}
</style>