<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import apiFiles from '@/api/apiFiles/index'

interface IProp {
    nodeCurryInfo: any,
    curryInfo: any,
    title: string
    type: number
}
const props = withDefaults(defineProps<IProp>(), {
    nodeCurryInfo: {},
    curryInfo: {},
    title: 'API设置',
    type: 1
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any
interface IData {
    formData: any,
    formDataBK: any,
    formRules: any,
    tableFromData: any,
    submitLoading: boolean,
}
const data = reactive<IData>({
    formData: {
        name: '',
        level: '',
        description: '',
        sort: 0,
    },
    formDataBK: {},
    formRules: {
        name: [{ required: true, message: '请输入接口名称', trigger: ['change', 'blur'] }],
        level: [{ required: true, message: '请选择层级', trigger: ['change', 'blur'] }],
        description: [{ required: true, message: '请输入描述', trigger: ['change', 'blur'] }],
        sort: [{ required: true, message: '请输入排序', trigger: ['change', 'blur'] }],
    },
    tableFromData: {},
    submitLoading: false,
})
const handleReset = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    emits('update:modelValue', false)
}
const handleClose = () => {
    handleReset()
    emits('refresh')
    searchQueryHandler()
    emits('update:modelValue', false)
}
const searchQueryHandler = inject('searchQueryHandler', () => { })
onMounted(() => {
    data.formDataBK = cloneDeep(data.formData)
})
const openHandler = () => {
    data.formData = {
        ...data.formDataBK
    }
    if (props.curryInfo?.id) {
        data.formData = {
            ...data.formData,
            ...props.curryInfo
        }
    }
}
const handleSubmit = () => {
    formRef.value.validate().then(() => {
        let parentId = props?.nodeCurryInfo?.id || 0
        if (props.curryInfo?.id) {
            parentId = props.curryInfo.parentId
        }
        apiFiles.A_apiCateSave({
            ...data.formData,
            parentId,
            type: props.type
        }).then((res: any) => {
            emits('refresh')
            handleClose()
        })
    })
}
</script>
<template>
    <el-dialog v-bind="$attrs" :title="title" width="500px" append-to-body @open="openHandler" draggable
        destroy-on-close :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-form-item label="目录名称" prop="name">
                    <el-input v-model="data.formData.name" placeholder="请输入" maxlength="200" show-word-limit />
                </el-form-item>
                <el-form-item label="目录备注">
                    <el-input v-model="data.formData.description" type="textarea" placeholder="请输入" maxlength="500"
                        show-word-limit />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="data.formData.sort
                        " placeholder="请输入" controls-position="right" precision="0" step="1" min="0" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped></style>