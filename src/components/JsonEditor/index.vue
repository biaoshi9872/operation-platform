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
                            emit('error', (e as Error).message)
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
        console.error('CodeMirror initialization error:', error)
    }
}

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