<script setup lang="ts">
import after_order_api from '@/api/afterOrder/index';
import isStateCheckHooks from '@/hooks/isStateCheckHooks';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';
const { isFromOrgLast, getSystemOptionType } = isStateCheckHooks()
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
    returnInfo: any
}
const data = reactive<IData>({
    formData: {
        "afterSaleNo": "",
        "auditStatus": 1,
        "rejectReason": "",
        "serviceRemark": "",
        freightAmount: 0,
        "refundCustomerPrice": 0
    },
    formDataBK: {},
    formRules: {
        auditStatus: [{ required: true, message: '请选择审核类型', trigger: ['change', 'blur'] }],
        rejectReason: [{ required: true, message: '请输入处理意见', trigger: ['change', 'blur'] }],
        refundCustomerPrice: [{ required: true, message: '请输入退用户金额', trigger: ['change', 'blur'] }],
        freightAmount: [{ required: true, message: '请输入退运费金额', trigger: ['change', 'blur'] }],
    },
    returnInfo: {
        freightAmount: null,
        preRetailPrice: null,
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
    getFindAfterSalePrice()
}

const getFindAfterSalePrice = () => {
    const afterSaleNo = props.curryInfo.afterSaleNo
    after_order_api.A_findAfterSalePrice({ afterSaleNo }).then((res: any) => {
        data.returnInfo = res
    })
}
const checkReturnStates = (callBack: any) => {
    if (data.formData.auditStatus == 1) {
        if (data.formData.refundCustomerPrice > (data.returnInfo.preRetailPrice + data.returnInfo.freightAmount)) {
            ElMessageBox.confirm(
                `输入的退用户金额大于售后商品金额+订单运费之和，是否确认进行该操作?`,
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(() => {
                    callBack()
                })
        } else {
            callBack()
        }
    } else {
        callBack()
    }
}
const handleSubmit = () => {
    // checkReturnStates(saveData)
    saveData()
}
const saveData = () => {
    formRef.value.validate().then(() => {
        data.submitLoading = true
        const afterSaleNo = props.curryInfo.afterSaleNo
        after_order_api.A_audit({ ...data.formData, afterSaleNo }).then(() => {
            data.submitLoading = false
            handleClose()
            ElMessage.success('操作成功')
        }).finally(() => {
            data.submitLoading = false
        })
    })
}
</script>
<template>
    <el-dialog v-bind="$attrs" title="售后确认" width="500px" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-form-item label="审核" prop="auditStatus">
                    <el-radio-group v-model="data.formData.auditStatus">
                        <el-radio :value="1">通过</el-radio>
                        <el-radio :value="2">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="data.formData.auditStatus === 1"
                    :label="getSystemOptionType == 401 ? '含税供应价' : '分销价'">
                    <span>{{ data.returnInfo.preRetailPrice }}</span>
                </el-form-item>
                <el-form-item v-if="data.formData.auditStatus === 1" label="退用户" prop="refundCustomerPrice">
                    <el-input-number v-model="data.formData.refundCustomerPrice" :controls="false"
                        :max="data.returnInfo.preRetailPrice" :precision="2"></el-input-number>
                </el-form-item>
                <el-form-item v-if="data.formData.auditStatus === 1" label="退运费" prop="freightAmount">
                    <el-input-number v-model="data.formData.freightAmount" :controls="false"
                        :max="data.returnInfo.freightAmount" :precision="2"></el-input-number>
                </el-form-item>
                <el-form-item label="处理意见" prop="rejectReason">
                    <el-input v-model="data.formData.rejectReason" placeholder="售后处理意见，展示给前端用户" type="textarea"
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