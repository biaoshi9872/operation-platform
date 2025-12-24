<script setup lang="ts">
defineOptions({
    name: 'unLineAfterSaleOrder'
})
import after_order_api from '@/api/afterOrder/index'
import { tabsStore } from '@/stores'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
const $useRote = useRoute()
const emit = defineEmits(['refresh'])
const tabsStoreInfo: any = tabsStore()

const formRef = ref<FormInstance>()
const cancelHandler = () => {
    goBarkOrderList()
}


const data = reactive({
    formData: {
        afterSaleType: '',
        reasonCode: '',
        reasonName: '',
        goodsStatus: '',
        afterSaleNum: 1,
        reasonImages: '',
        reasonDescription: ''
    },
    detailInfo: {
        applyUserName: '',
        afterSaleAmount: '',
        applyUserMobile: '',
        channelOrderNo: '',
        reasonDescription: '',
        orgId: '',
        appId: ''
    },
    afterSaleGoods: [],
    outerRefundList: [],
    submitLoading: false,
    formRules: {
        afterSaleType: [{ required: true, message: '请选择售后类型', trigger: 'change' }],
        goodsStatus: [{ required: true, message: '请选择货物状态', trigger: 'change' }],
        reasonCode: [{ required: true, message: '请选择退款原因', trigger: 'change' }],
        reasonDescription: [{ required: true, message: '请选择退款原因', trigger: ['change', 'blur'] }]
    }
})
const saveHandler = () => {
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            data.submitLoading = true
            const { orgId, appId, channelOrderNo } = data.detailInfo
            const afterSaleGoodsList = data.afterSaleGoods
            let obj = { ...data.formData, orgId, appId, channelOrderNo, afterSaleGoodsList } as any
            after_order_api.A_backApply(obj).then((res: any) => {
                ElMessage.success('操作完成')
                emit('refresh')
                goBarkOrderList()
            }).finally(() => {
                data.submitLoading = false
            })
        }
    })
}

const goBarkOrderList = () => {
    tabsStoreInfo.close($useRote, {
        path: '/orderManagement/order/index'
    })
}

onMounted(() => {
    debugger
    getDetailInfo()
})

//获取详情
const getDetailInfo = () => {
    const { channelOrderNo, skuCode } = $useRote.query as any
    channelOrderNo && after_order_api.A_preAfterOrderDetail({ channelOrderNo, skuCode, type: 1 }).then((res: any) => {
        data.detailInfo = {
            ...data.detailInfo,
            ...res
        }
        data.afterSaleGoods = [{ ...res.afterSaleGoodsVO, afterSaleNum: res.afterSaleGoodsVO.goodsNum }]
    })
    channelOrderNo && after_order_api.A_afterSaleRender({ channelOrderNo, skuCode, type: 1 }).then((res: any) => {
        data.outerRefundList = [
            ...data.outerRefundList,
            ...(res?.date || [])
        ] as any
    })
}
//退款总金额
const afterSaleAmount = computed(() => {
    const total = data.afterSaleGoods.reduce((total: any, curry: any) => {
        let retailPrice = curry.retailPrice
        return (total += curry.afterSaleNum * retailPrice)
    }, 0)
    return total.toFixed(2)
})


const verifyHandler = () => {
    formRef.value?.validateField('reasonImages')
}
const goDetailHandler = () => {
    tabsStoreInfo.close($useRote, {
        path: '/orderManagement/order/orderDetail',
        query: {
            channelOrderNo: data.detailInfo.channelOrderNo
        }
    })
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
    <CardModel title="基本信息">
        <div class="content_box">
            <div class="item">
                <span class="item_title">申请人:</span>
                <span class="item_value">{{ data.detailInfo.applyUserName }}</span>
            </div>
            <div class="item">
                <span class="item_title">联系电话:</span>
                <span class="item_value">{{ data.detailInfo.applyUserMobile }}</span>
            </div>
            <div class="item">
                <span class="item_title">订单号:</span>
                <span class="item_value">{{ data.detailInfo.orderNo }}
                    <el-button size="small" link @click="goDetailHandler" type="primary">查看订单详情</el-button>
                </span>
            </div>
        </div>
    </CardModel>
    <CardModel title="基本信息">
        <div>
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
                    <ImgUpload :limit="5" :maxSize="5" v-model="data.formData.reasonImages" :isArray="false"
                        @verify="verifyHandler" :acceptList="['bmp', 'png', 'jpg', 'jpeg']"></ImgUpload>
                </el-form-item>
                <el-form-item label="说明" prop="reasonDescription">
                    <el-input type="textarea" class="w-400" v-model="data.formData.reasonDescription" :rows="3"
                        maxlength="200" show-word-limit placeholder="请输入说明" />
                </el-form-item>
            </el-form>
        </div>
    </CardModel>
    <CardModel title="商品信息">
        <el-table style="width: 100%" :data="data.afterSaleGoods">
            <YbtTableColumn prop="date" label="商品信息" width="300">
                <template #default="{ row }">
                    <SkuDetail :customAttribute="{ url: 'images', name: 'skuName', id: 'skuCode' }" width="100%"
                        :goodDetail="row"></SkuDetail>
                </template>
            </YbtTableColumn>
            <YbtTableColumn prop="retailPrice" label="分销价">
                <template #default="{ row }">
                    <span>{{ `￥${row.retailPrice}` }}</span>
                </template>
            </YbtTableColumn>
            <YbtTableColumn prop="goodsNum" label="总量" />
            <YbtTableColumn prop="afterSaleNum" label="售后数量">
                <template #default="{ row }">
                    <el-input-number v-model="row.afterSaleNum" :min="1" :max="row.goodsNum" :precision="0" />
                </template>
            </YbtTableColumn>
        </el-table>
    </CardModel>
    <CardModel>
        <div class="option">
            <el-button @click="cancelHandler">取消</el-button>
            <el-button type="primary" :loading="data.submitLoading" @click="saveHandler">提交</el-button>
        </div>
    </CardModel>
</template>
<style lang="scss" scoped>
.content_box {
    @include grid_content_box(3);
}

.option {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
