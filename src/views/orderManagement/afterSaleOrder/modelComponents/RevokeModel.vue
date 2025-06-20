<script setup lang="ts">
import after_order_api from '@/api/afterOrder/index';
import { ElMessage, FormInstance } from 'element-plus';
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
        afterSaleNo: "",
        "cancelReason": "",
        "serviceRemark": ""
    },
    formDataBK: {},
    formRules: {
        auditStatus: [{ required: true, message: '请选择审核类型', trigger: ['change', 'blur'] }],
        cancelReason: [{ required: true, message: '请输入处理意见', trigger: ['change', 'blur'] }],
        refundCustomerPrice: [{ required: true, message: '请输入退用户金额', trigger: ['change', 'blur'] }],
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
        data.submitLoading = true
        const afterSaleNo = props.curryInfo.afterSaleNo
        after_order_api.A_cancel({ ...data.formData, afterSaleNo }).then(res => {
            data.submitLoading = false
            ElMessage.success('撤销成功')
            handleClose()
        }).finally(() => {
            data.submitLoading = false
        })
    })
}
</script>
<template>
    <el-dialog v-bind="$attrs" title="售后撤销" width="500px" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-alert title="售后处理意见用户可见，请谨慎填写" class="mb-12" type="warning" :closable="false" show-icon />
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-form-item label="处理意见" prop="cancelReason">
                    <el-input v-model="data.formData.cancelReason" placeholder="售后处理意见，展示给前端用户" type="textarea"
                        maxlength="200" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="客服备注">
                    <el-input v-model="data.formData.serviceRemark" placeholder="客户其他备注，将留存在售后详情" type="textarea"
                        maxlength="200" show-word-limit></el-input>
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