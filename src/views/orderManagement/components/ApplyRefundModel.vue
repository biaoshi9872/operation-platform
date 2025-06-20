<script setup lang="ts">
import after_order_api from '@/api/afterOrder/index';
import order_enum from '@/utils/constant/order';
import { ElMessage, FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';
interface IProp {
    curryInfo: any,
    orderInfo: any
}
const props = withDefaults(defineProps<IProp>(), {
    curryInfo: {},
    orderInfo: {}
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
    formDataBK: {},
    formData: {
        orderNo: '',
        afterSaleType: '',
        reasonCode: '',
        reasonName: '',
        afterSaleNum: 1,
        reasonImages: '',
        reasonDescription: ''
    },
    formRules: {
        afterSaleType: [{ required: true, message: '请选择售后类型', trigger: 'change' }],
        reasonCode: [{ required: true, message: '请选择退款原因', trigger: 'change' }],
        reasonImages: [{ required: true, message: '上传凭证', trigger: 'change' }],
        reasonDescription: [{ required: true, message: '请选择退款原因', trigger: ['change', 'blur'] }]
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
        const { channelOrderNo } = props.orderInfo.orderBaseInfo
        const { orgId, appId } = props.orderInfo
        const afterSaleGoodsList = [
            {
                ...props.curryInfo,
                afterSaleNum: data.formData.afterSaleNum
            }
        ]
        after_order_api.A_backApply({ ...data.formData, orgId, appId, channelOrderNo, afterSaleGoodsList }).then((res: any) => {
            handleClose()
            ElMessage.success('操作完成')
        }).finally(() => {
            data.submitLoading = false
        })
    })
}
const changeHandler = () => {
    data.formData.reasonCode = ''
}
const reasonForRefundList = computed(() => {
    return order_enum.reasonForRefundListObj[data.formData.afterSaleType]
})
const reasonChangeHandler = (value: any) => {
    data.formData.reasonName = reasonForRefundList.value.find((item: any) => item.value == value)?.label
}
//退款总金额
const afterSaleAmount = computed(() => {
    return (props.curryInfo.retailPrice * data.formData.afterSaleNum).toFixed(2)
})
const verifyHandler = () => {
    formRef.value?.validateField('reasonImages')
}

const afterSaleNumChangeHandler = (val: any) => {
    if (val > props.curryInfo.goodsNum) {
        ElMessage.warning('售后数量不能大于商品数量')
        data.formData.afterSaleNum = props.curryInfo.goodsNum
    }
}

</script>
<template>
    <el-dialog v-bind="$attrs" title="申请售后" width="650px" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-alert title="请按照与用户沟通的实际结果录入，默认返回方式为上门取件，取件地址为下单地址" class="mb-12" type="warning" :closable="false"
                show-icon />
            <el-form ref="formRef" :model="data.formData" label-suffix=":" label-position="right" label-width="100px"
                :rules="data.formRules">
                <el-form-item label="售后类型" prop="afterSaleType">
                    <el-select v-model="data.formData.afterSaleType" class="w-400" @change="changeHandler">
                        <el-option v-for="(item, index) in order_enum.AfterSalesType" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退款原因" prop="reasonCode">
                    <el-select v-model="data.formData.reasonCode" class="w-400" @change="reasonChangeHandler">
                        <el-option v-for="(item, index) in reasonForRefundList" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="['4', '3', '2'].includes(data.formData.afterSaleType)" label="退款总金额">
                    <span>￥{{ afterSaleAmount }}</span>
                </el-form-item>
                <el-form-item label="售后数量">
                    <el-input-number v-model="data.formData.afterSaleNum" class="w-400" min="1"
                        :max="curryInfo.goodsNum" precision="0" @change="afterSaleNumChangeHandler"></el-input-number>
                </el-form-item>
                <el-form-item label="上传凭证">
                    <ImgUpload :limit="3" :maxSize="5" v-model="data.formData.reasonImages" :isArray="false"
                        @verify="verifyHandler" :acceptList="['bmp', 'png', 'jpg', 'jpeg']"></ImgUpload>
                </el-form-item>
                <el-form-item label="说明" prop="reasonDescription">
                    <el-input type="textarea" class="w-400" v-model="data.formData.reasonDescription" :rows="3"
                        maxlength="200" show-word-limit placeholder="请输入说明" />
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