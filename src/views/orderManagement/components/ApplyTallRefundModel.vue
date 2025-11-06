<script setup lang="ts">
import after_order_api from '@/api/afterOrder/index';
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
    outerRefundList: any[],
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
        goodsStatus: [{ required: true, message: '请选择货物状态', trigger: 'change' }],
        reasonCode: [{ required: true, message: '请选择退款原因', trigger: 'change' }],
        reasonDescription: [{ required: true, message: '请选择退款原因', trigger: ['change', 'blur'] }]
    },
    outerRefundList: [],
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
    if (props.curryInfo) {
        data.formData.afterSaleNum = props.curryInfo?.goodsNum || 1
        let { channelOrderNo } = props.orderInfo.orderBaseInfo
        let { skuCode } = props.curryInfo
        channelOrderNo && after_order_api.A_afterSaleRender({ channelOrderNo, skuCode }).then((res: any) => {
            data.outerRefundList = [
                ...data.outerRefundList,
                ...(res?.date || [])
            ] as any
        })
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
//退款总金额
const afterSaleAmount = computed(() => {
    return (props.curryInfo.retailPrice * data.formData.afterSaleNum).toFixed(2)
})

const verifyHandler = () => {
    formRef.value?.validateField('reasonImages')
}

/**
 * 售后原因
 */
const afterSalesTypeList: any = computed(() => {
    return data.outerRefundList.map((item: any) => {
        return {
            label: item.outerRefundTypeName,
            value: item.outerRefundType,
            ...item
        }
    }).filter((item: any) => !!item.outerRefundTypeName)
})

/**
 * 发货状态
 */
const goodStatesList: any = computed(() => {
    let curryAfterSalesType = afterSalesTypeList.value?.find((item: any) => item.outerRefundType == data.formData.afterSaleType)?.refundTypeRenderDetailList || []
    return curryAfterSalesType.map((item: any) => {
        return {
            label: item.sellerGoodsStatusName,
            value: item.buyerGoodsStatus,
            ...item
        }
    })
})

/**
 * 售后原因
 */
const reasonForRefundList: any = computed(() => {
    let currencyGoodsStatus = goodStatesList.value?.find((item: any) => item.buyerGoodsStatus == data.formData.goodsStatus)?.reasonDetail || []
    return currencyGoodsStatus.map((item: any) => {
        return {
            label: item.outerReasonName,
            value: item.outerReasonId,
            ...item
        }
    })
})
const changeHandler = () => {
    data.formData.reasonCode = ''
    data.formData.reasonName = ''
    data.formData.goodsStatus = ''
}
const goodsStatusHandler = (value: any) => {
    data.formData.reasonCode = ''
    data.formData.reasonName = ''
}
const reasonChangeHandler = (value: any) => {
    data.formData.reasonName = reasonForRefundList.value?.find((item: any) => item.value == value)?.label || ''
}

/**
 * 上传凭证必填
 */
const isUploadVoucherRequired: any = computed(() => {
    return reasonForRefundList.value.find((item: any) => item.outerReasonId == data.formData.reasonCode)?.needOfferPic || false
})

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
                    <el-radio-group v-model="data.formData.afterSaleType" @change="changeHandler">
                        <el-radio v-for="(item, index) in afterSalesTypeList" :label="item.value">{{ item.label
                            }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="退款总金额">
                    <span>￥{{ afterSaleAmount }}</span>
                </el-form-item>
                <el-form-item label="货物状态" prop="goodsStatus">
                    <el-select v-model="data.formData.goodsStatus" class="w-400" @change="goodsStatusHandler">
                        <el-option v-for="(item, index) in goodStatesList" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退款原因" prop="reasonCode">
                    <el-select v-model="data.formData.reasonCode" class="w-400" @change="reasonChangeHandler">
                        <el-option v-for="(item, index) in reasonForRefundList" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传凭证" prop="reasonImages"
                    :rules="[{ required: isUploadVoucherRequired, message: '请上传凭证', trigger: ['blur', 'change'] }]">
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