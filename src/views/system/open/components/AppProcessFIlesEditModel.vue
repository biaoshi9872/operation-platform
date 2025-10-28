<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import MDTinymce from '@/components/MDTinymce/index.vue'
import apiFiles from '@/api/apiFiles/index'

interface IProps {
    nodeCurryInfo: any,
    curryInfo: any
}
const props = withDefaults(defineProps<IProps>(), {
    nodeCurryInfo: {},
    curryInfo: {}
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any
const data = reactive<any>({
    formData: {
        "id": "",
        "cateId": "",
        "apiName": "",
        "apiUrl": "",
        "description": "",
    },
    formDataBK: {},
    formRules: {
        apiName: [{ required: true, message: '请输入文档名称', trigger: ['change', 'blur'] }],
        apiUrl: [{ required: true, message: '请输入文档简介', trigger: ['change', 'blur'] }],
    },
    optionType: 2,
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
        ...cloneDeep(data.formDataBK)
    }
    if (props.curryInfo?.id) {
        apiFiles.A_apiInterfaceDetail(props.curryInfo.id).then((res) => {
            data.formData = res
        })
    }
}

const handleSubmit = () => {
    formRef.value.validate().then(() => {
        const cateId = props.nodeCurryInfo.id
        apiFiles.A_apiInterfaceSave({
            ...data.formData,
            cateId,
            type: data.optionType
        }).then((res: any) => {
            ElMessage.success('保存成功')
            emits('refresh')
            handleClose()
        })
    })
}

</script>
<template>
    <el-drawer v-bind="$attrs" :close-on-click-modal="false" title="API文档编辑" size="80%" @closed="handleReset"
        @open="openHandler">
        <div class="api_container">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-form-item label="文档名称" prop="apiName">
                    <el-input v-model="data.formData.apiName" maxlength="100" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="文档简介">
                    <el-input v-model="data.formData.apiUrl" maxlength="500" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="功能描述" prop="description">
                    <MDTinymce v-model="data.formData.description"></MDTinymce>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<style lang="scss" scoped>
.api_container {
    ::v-deep(.el-card__header) {
        color: var(--el-color-primary);
    }

    ::v-deep(.el-table .success-row) {
        --el-table-tr-bg-color: var(--el-color-success-light-9);
    }

    ::v-deep(.el-table__cell) {
        height: 65px !important;
    }

    ::v-deep(.cm-scroller) {
        border: 1px solid var(--el-border-color-light);
        min-height: 100px;
    }

}
</style>