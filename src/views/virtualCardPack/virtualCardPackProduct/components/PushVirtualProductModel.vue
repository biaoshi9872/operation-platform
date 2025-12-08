<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
interface IProp {
    curryInfo: any,
}
const props = withDefaults(defineProps<IProp>(), {
    curryInfo: {}
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
        stockNum: ''
    },
    formDataBK: {},
    formRules: {
        stockNum: [{ required: true, message: '请输入商品数量', trigger: ['change', 'blur'] }],
    },
    tableFromData: [
        {
            id: 1,
            label: 'Level one 1',
            children: [
                {
                    id: 4,
                    label: 'Level two 1-1',
                    disabled: true,
                },
                {
                    id: 4,
                    label: 'Level two 1-1',
                    disabled: true,
                },
                {
                    id: 4,
                    label: 'Level two 1-1',
                    disabled: false,

                },
            ],
        },
        {
            id: 2,
            label: 'Level one 2',
            children: [
                {
                    id: 5,
                    label: 'Level two 2-1',
                },
                {
                    id: 6,
                    label: 'Level two 2-2',
                },
            ],
        },
        {
            id: 3,
            label: 'Level one 3',
            children: [
                {
                    id: 7,
                    label: 'Level two 3-1',
                },
                {
                    id: 8,
                    label: 'Level two 3-2',
                },
            ],
        },
    ],
    submitLoading: false,
})
const handleReset = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    emits('update:modelValue', false)
}
const defaultProps = {
    children: 'children',
    disabled: 'disabled',
    label: 'label',
}
const handleSelectionChange = (val: any) => {
    console.log(val)
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
}
const handleSubmit = () => {
    formRef.value.validate().then(() => {
    })
}
</script>
<template>
    <el-dialog v-bind="$attrs" title="选择推送应用" class="dialog-m" append-to-body @open="openHandler" draggable
        destroy-on-close :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-tree style="max-width: 600px" :data="data.tableFromData" show-checkbox node-key="id"
                @change="handleSelectionChange" :props="defaultProps" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认推送</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<style lang="scss" scoped></style>