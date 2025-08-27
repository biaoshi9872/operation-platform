<script setup lang="ts">
import after_order_api from '@/api/afterOrder/index';
import isStateCheckHooks from '@/hooks/isStateCheckHooks';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import systemUtils_api from '@/api/system/systemUtils'
// 新增导入图标
import { WarningFilled } from '@element-plus/icons-vue'
const { isFromOrgLast, getSystemOptionType } = isStateCheckHooks()
interface IProp {
    curryInfo: any,
    title: string
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
    logisticsCompanyList: any[],
    returnInfo: any
}
const addressSelectRef = ref<any>()
const data = reactive<IData>({
    formData: {
        "afterSaleNo": null,
        "afterSaleType": null,
        "afterNode": null,
        "returnAddressInfo": {
            "auditStatus": null,
            "rejectReason": null,
            "returnUserName": null,
            "returnUserMobile": null,
            "returnProvinceId": null,
            "returnCityId": null,
            "returnCountyId": null,
            "returnTownId": null,
            "returnProvinceName": null,
            "returnCityName": null,
            "returnAreaName": null,
            "returnStreetName": null,
            "returnAddress": null
        },
        "returnTrack": {
            "returnLogisticsCode": null,
            "returnLogisticsName": null,
            "returnTrackNo": null
        },
        "exchangeTrack": {
            "exchangeLogisticsCode": null,
            "exchangeLogisticsName": null,
            "exchangeTrackNo": null
        },
        "excludeAudit": {
            "auditStatus": null,
            "rejectReason": null,
            "refundCustomerPrice": null,
            "freightAmount": null
        },
        // 新增：备注字段，模板中已使用
        "serviceRemark": null,
    },
    formDataBK: {},
    formRules: {
        'returnAddressInfo.auditStatus': [{ required: true, message: '请选择审核类型', trigger: ['change', 'blur'] }],
        'returnAddressInfo.rejectReason': [{ required: true, message: '请输入处理意见', trigger: ['change', 'blur'] }],
        'returnAddressInfo.returnUserName': [{ required: true, message: '请输入用户姓名', trigger: ['change', 'blur'] }],
        'returnAddressInfo.returnUserMobile': [
            { required: true, message: '请输入用户手机号', trigger: ['change', 'blur'] },
            {
                validator: (rule: any, value: any, callback: any) => {
                    if (!/^1[3456789]\d{9}$/.test(value)) {
                        callback(new Error('请输入正确的手机号'))
                    } else {
                        callback()
                    }
                }, trigger: ['change', 'blur']
            },
            { min: 11, max: 11, message: '请输入正确的手机号', trigger: ['change', 'blur'] }
        ],
        'returnAddressInfo.addrInfo': [
            // 修复点：去掉 required，仅保留自定义校验，避免因虚拟字段值为 undefined 导致必填永远失败
            {
                validator: (rule: any, value: any, callback: any) => {
                    const ref = addressSelectRef?.value
                    if (ref && typeof ref.validate === 'function') {
                        ref.validate().then(() => {
                            callback()
                        }).catch(() => {
                            callback(new Error('请选择完整的地区信息'))
                        })
                        return
                    }
                    // 兜底：ref 不可用时，检查 formData 中省/市/区是否完整
                    const info = (data.formData?.returnAddressInfo) || {}
                    const okByName = info.returnProvinceName && info.returnCityName && info.returnAreaName
                    const okById = info.returnProvinceId && info.returnCityId && info.returnAreaId
                    if (okByName || okById) {
                        callback()
                    } else {
                        callback(new Error('请选择完整的地区信息'))
                    }
                },
                trigger: ['change', 'blur']
            }
        ],
        'returnAddressInfo.returnProvinceName': [{ required: true, message: '请选择用户省份', trigger: ['change', 'blur'] }],
        'returnAddressInfo.returnCityName': [{ required: true, message: '请选择用户城市', trigger: ['change', 'blur'] }],
        'returnAddressInfo.returnAreaName': [{ required: true, message: '请选择用户区县', trigger: ['change', 'blur'] }],
        'returnTrack.returnLogisticsCode': [{ required: true, message: '请选择物流公司', trigger: ['change', 'blur'] }],
        'returnTrack.returnTrackNo': [{ required: true, message: '请输入物流单号', trigger: ['change', 'blur'] }],
        'exchangeTrack.exchangeLogisticsCode': [{ required: true, message: '请选择物流公司', trigger: ['change', 'blur'] }],
        'exchangeTrack.exchangeTrackNo': [{ required: true, message: '请输入物流单号', trigger: ['change', 'blur'] }],
        'excludeAudit.auditStatus': [{ required: true, message: '请选择审核类型', trigger: ['change', 'blur'] }],
        'excludeAudit.rejectReason': [{ required: true, message: '请输入处理意见', trigger: ['change', 'blur'] }],
        'excludeAudit.refundCustomerPrice': [{ required: true, message: '请输入退用户金额', trigger: ['change', 'blur'] }],
        'excludeAudit.freightAmount': [{ required: true, message: '请输入退运费金额', trigger: ['change', 'blur'] }],
    },
    returnInfo: {
        freightAmount: null,
        preRetailPrice: null,
    },
    logisticsCompanyList: [],
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
        ...cloneDeep(data.formDataBK)
    }
    getFindAfterSalePrice()
    queryComList()
}

const getFindAfterSalePrice = () => {
    const afterSaleNo = props.curryInfo.afterSaleNo
    after_order_api.A_findAfterSalePrice({ afterSaleNo }).then((res: any) => {
        data.returnInfo = res
    })
}
const queryComList = () => {
    systemUtils_api.A_getLogisticList().then((res: any) => {
        data.logisticsCompanyList = res
    })
}

// 新增：根据选择的代码同步名称（退货物流）
const onReturnLogisticsCodeChange = (code: string) => {
    const item = (data.logisticsCompanyList || []).find(
        (it: any) => it.companyCode === code || it.companyName === code
    )
    // 以 code 为主进行回填；若找不到，则仅保留 code，名称置空
    data.formData.returnTrack.returnLogisticsCode = item?.companyCode ?? code
    data.formData.returnTrack.returnLogisticsName = item?.companyName ?? null
}

// 新增：根据选择的代码同步名称（换货物流）
const onExchangeLogisticsCodeChange = (code: string) => {
    const item = (data.logisticsCompanyList || []).find(
        (it: any) => it.companyCode === code || it.companyName === code
    )
    data.formData.exchangeTrack.exchangeLogisticsCode = item?.companyCode ?? code
    data.formData.exchangeTrack.exchangeLogisticsName = item?.companyName ?? null
}

const handleSubmit = () => {
    saveData()
}
const changeHandler = () => {
    // 修正：清空对应的嵌套驳回原因，避免清空一个不存在的顶层字段
    data.formData.returnAddressInfo.rejectReason = ''
    data.formData.excludeAudit.rejectReason = ''
}
const saveData = () => {
    formRef.value.validate().then(() => {
        data.submitLoading = true
        const afterSaleNo = props.curryInfo.afterSaleNo
        const afterSaleType = props.curryInfo.afterSaleType
        const afterNode = props.curryInfo.afterNode
        after_order_api.A_auditEC({ ...data.formData, afterSaleNo, afterSaleType, afterNode }).then(() => {
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
    <el-dialog v-bind="$attrs" :title="title" width="500px" append-to-body @open="openHandler" draggable
        destroy-on-close :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <!-- 1.审核动作-->
                <template v-if="curryInfo.afterNode == 1">
                    <el-form-item label="审核" prop="returnAddressInfo.auditStatus">
                        <el-radio-group v-model="data.formData.returnAddressInfo.auditStatus" @change="changeHandler">
                            <el-radio :value="1">通过</el-radio>
                            <el-radio :value="2">不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="data.formData.returnAddressInfo.auditStatus == 1">
                        <el-form-item label="联系人" prop="returnAddressInfo.returnUserName">
                            <el-input v-model="data.formData.returnAddressInfo.returnUserName" show-word-limit
                                maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="returnAddressInfo.returnUserMobile">
                            <el-input v-model="data.formData.returnAddressInfo.returnUserMobile" show-word-limit
                                maxlength="11"></el-input>
                        </el-form-item>
                        <el-form-item label="所在地区" prop="returnAddressInfo.addrInfo">
                            <AddressSelect :openStreet="true" ref="addressSelectRef"
                                v-model:provinceName="data.formData.returnAddressInfo.returnProvinceName"
                                v-model:provinceId="data.formData.returnAddressInfo.returnProvinceId"
                                v-model:cityName="data.formData.returnAddressInfo.returnCityName"
                                v-model:cityId="data.formData.returnAddressInfo.returnCityId"
                                v-model:countyName="data.formData.returnAddressInfo.returnAreaName"
                                v-model:countyId="data.formData.returnAddressInfo.returnAreaId"
                                v-model:townName="data.formData.returnAddressInfo.returnStreetName"
                                v-model:townId="data.formData.returnAddressInfo.returnStreetId"></AddressSelect>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="returnAddressInfo.returnAddress">
                            <el-input v-model="data.formData.returnAddressInfo.returnAddress" type="textarea"
                                maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="data.formData.returnAddressInfo.rejectReason" type="textarea"
                                maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                    </template>
                    <template v-if="data.formData.returnAddressInfo.auditStatus == 2">
                        <el-form-item label="拒绝理由" prop="returnAddressInfo.rejectReason">
                            <el-input v-model="data.formData.returnAddressInfo.rejectReason" type="textarea"
                                maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                    </template>
                </template>
                <!-- 2.上传退货物流-->
                <template v-if="curryInfo.afterNode == 2">
                    <el-form-item label="物流公司" prop="returnTrack.returnLogisticsCode">
                        <el-select v-model="data.formData.returnTrack.returnLogisticsCode" placeholder="请选择物流公司"
                            @change="onReturnLogisticsCodeChange">
                            <el-option v-for="item in data.logisticsCompanyList" :key="item.companyCode"
                                :label="item.companyName" :value="item.companyCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号" prop="returnTrack.returnTrackNo">
                        <el-input v-model="data.formData.returnTrack.returnTrackNo" placeholder="请输入快递单号"
                            show-word-limit maxlength="20"></el-input>
                    </el-form-item>
                </template>
                <!-- 3.上传发货物流-->
                <template v-if="curryInfo.afterNode == 3">
                    <el-form-item label="物流公司" prop="exchangeTrack.exchangeLogisticsCode">
                        <el-select v-model="data.formData.exchangeTrack.exchangeLogisticsCode" placeholder="请选择物流公司"
                            @change="onExchangeLogisticsCodeChange">
                            <el-option v-for="item in data.logisticsCompanyList" :key="item.companyCode"
                                :label="item.companyName" :value="item.companyCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号" prop="exchangeTrack.exchangeTrackNo">
                        <el-input v-model="data.formData.exchangeTrack.exchangeTrackNo" placeholder="请输入快递单号"
                            show-word-limit maxlength="20"></el-input>
                    </el-form-item>
                </template>
                <!-- 4.确认收货-->
                <template v-if="curryInfo.afterNode == 4">
                    <div class="text-center"><el-icon class="color-[var(--el-color-warning)] mr-2">
                            <WarningFilled />
                        </el-icon>是否确认已收到退货？</div>
                </template>
                <!-- 5.用户确认收货-->
                <template v-if="curryInfo.afterNode == 5">
                    <div class="text-center"><el-icon class="color-[var(--el-color-warning)] mr-2">
                            <WarningFilled />
                        </el-icon>是否确认已收到货？</div>
                </template>
                <!-- 6.退款动作-->
                <template v-if="curryInfo.afterNode == 6">
                    <el-form-item label="退款意见" prop="excludeAudit.auditStatus">
                        <el-radio-group v-model="data.formData.excludeAudit.auditStatus" @change="changeHandler">
                            <el-radio :value="1">通过</el-radio>
                            <el-radio :value="2">不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="data.formData.excludeAudit.auditStatus === 1" label="分销价">
                        <span>{{ data.returnInfo.preRetailPrice }}</span>
                    </el-form-item>
                    <el-form-item v-if="data.formData.excludeAudit.auditStatus === 1 && curryInfo.channelSource != 105"
                        label="运费">
                        <span>{{ data.returnInfo.freightAmount }}</span>
                    </el-form-item>
                    <el-form-item v-if="data.formData.excludeAudit.auditStatus === 1" label="退用户"
                        prop="excludeAudit.refundCustomerPrice">
                        <el-input-number v-model="data.formData.excludeAudit.refundCustomerPrice" :controls="false"
                            :max="data.returnInfo.preRetailPrice" :precision="2"></el-input-number>
                    </el-form-item>
                    <el-form-item v-if="data.formData.excludeAudit.auditStatus === 1 && curryInfo.channelSource != 105"
                        label="退运费" prop="excludeAudit.freightAmount">
                        <el-input-number v-model="data.formData.excludeAudit.freightAmount" :controls="false"
                            :max="data.returnInfo.freightAmount" :precision="2"></el-input-number>
                    </el-form-item>
                    <el-form-item v-if="data.formData.excludeAudit.auditStatus === 2" label="拒绝原因"
                        prop="excludeAudit.rejectReason">
                        <el-input v-model="data.formData.excludeAudit.rejectReason" placeholder="拒绝原因，展示给前端用户"
                            type="textarea" maxlength="200" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="备注" v-if="data.formData.excludeAudit.auditStatus === 1">
                        <el-input v-model="data.formData.excludeAudit.rejectReason" placeholder="备注，将留存在售后详情"
                            type="textarea" maxlength="200" show-word-limit></el-input>
                    </el-form-item>
                </template>
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