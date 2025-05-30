<script setup lang="ts">
import { FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';
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
        userId: 33,
        "supplierId": 500000,
        "username": "zhangsan",
        "password": "a123456",
        "contractName": "张三",
        "contractTel": "13333333333",
        "accountValidStart": "2025-05-01 00:00:00",
        "accountValidEnd": "2025-05-30 23:59:59",
        "enableEnum": 1
    },
    formDataBK: {},
    formRules: {

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
}
const handleSubmit = () => {
    formRef.value.validate().then(() => {
    })
}
</script>
<template>
    <el-dialog v-bind="$attrs" title="设定库存" width="500px" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">

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
