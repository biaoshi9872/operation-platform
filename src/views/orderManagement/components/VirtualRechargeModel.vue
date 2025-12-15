<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import order_api from '@/api/order'
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
        accountNo: ''
    },
    formDataBK: {},
    formRules: {
        accountNo: [{ required: true, message: '请输入兑换账号', trigger: ['change', 'blur'] }],
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
    emits('update:modelValue', false)
}
onMounted(() => {
    data.formDataBK = cloneDeep(data.formData)
})
const openHandler = () => {
    data.formData = {
        ...data.formDataBK
    }
    data.formData.accountNo = props.curryInfo.accountNo
}
const handleSubmit = () => {
    formRef.value.validate().then(() => {
        data.submitLoading = true
        order_api.A_receiveCoupon({
            ...data.formData,
            couponKey: props.curryInfo.couponKey
        }).then(() => {
            emits('refresh')
            handleClose()
            ElMessage.success('操作成功')
        }).finally(() => {
            data.submitLoading = false
        })
    })
}
</script>
<template>
    <el-dialog v-bind="$attrs" title="重试" width="450" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-form-item label="兑换账号" prop="accountNo">
                    <el-input class="w-300" v-model="data.formData.accountNo" placeholder="请输入兑换账号" />
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