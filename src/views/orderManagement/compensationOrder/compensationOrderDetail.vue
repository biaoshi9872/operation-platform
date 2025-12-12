<script setup lang="ts">
defineOptions({
    name: 'compensationOrderDetail'
})
import OrderStateNode from './components/OrderStateNode.vue'
import OrderInfoCell from './components/OrderInfoCell.vue'
import OrderProductCell from './components/OrderProductCell.vue'
import after_order_api from '@/api/afterOrder/index'
import order_enum from '@/utils/constant/order'
import ConfirmReceiptModel from './components/ConfirmReceiptModel.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

interface IData {
    detail: {
        afterSaleNo: String
        applyTime: String
        orderNo: String
        afterSaleType: String
        merchantName: String
        applyUserName: String
        applyUserMobile: String
        supplyName: String
        reasonName: String
        reasonDescription: String
        currentFlowNodeName: String
        currentFlowNodeCode: String
        cancelReason: String
        rejectReason: String
        channelSource: '1' | '2' //1.平台 2京东
        expressCode: ''
        status: String
        orderDeliverVOList: any //物流信息
        receiveUserInfo: any //仓库信息
        sendUserInfo: any
    },
    showConfirmReceipt: false
}

const dataPage = reactive<IData>({
    detail: {
        afterSaleNo: '',
        applyTime: '',
        orderNo: '',
        afterSaleType: '',
        merchantName: '',
        applyUserName: '',
        applyUserMobile: '',
        supplyName: '',
        reasonName: '',
        reasonDescription: '',
        currentFlowNodeCode: '',
        currentFlowNodeName: '',
        cancelReason: '',
        rejectReason: '',
        channelSource: '1', //1京东 2平台
        expressCode: '',
        status: '',
        orderDeliverVOList: [],
        receiveUserInfo: {},
        sendUserInfo: {}
    },
    showConfirmReceipt: false
})

onMounted(async () => {
    init()
})

const init = () => {
    queryAfterSaleOrderInfo()
}

//订单详情
const queryAfterSaleOrderInfo = () => {
    const { afterSaleNo }: any = route.query
    after_order_api.A_detail({ afterSaleNo }).then((res: any) => {
        dataPage.detail = {
            ...dataPage.detail,
            ...res
        }
    })
}

//售后状态
const statusName = computed(() => {
    return order_enum.getAfter_order_statesTitle(dataPage.detail.status + '') + (dataPage?.detail?.status == '1' ? (dataPage?.detail?.currentFlowNodeName == '无节点' ? '' : `(${dataPage?.detail?.currentFlowNodeName})`) : '')
})

//确认已到账
const confirmArrival = () => {
    dataPage.showConfirmReceipt = true
}

</script>
<template>
    <div class="process-edit">
        <CardModel v-auth="{ authKey: 'ORDER_QRDZ_PF' }" iconName="menu-order">
            <AuthButton type="primary" @click="confirmArrival">确认已到账</AuthButton>
        </CardModel>
        <CardModel iconName="menu-order">
            <OrderStateNode></OrderStateNode>
        </CardModel>
        <CardModel iconName="menu-order" :title="`售后状态:${statusName}`">
            <OrderInfoCell :orderInfo="dataPage.detail"></OrderInfoCell>
        </CardModel>
        <CardModel title="赔付信息">
            <OrderProductCell :orderInfo="dataPage.detail"></OrderProductCell>
        </CardModel>
        <CardModel title="赔付处理详情">
            <el-timeline style="max-width: 1000px" class="mt-24">
                <el-timeline-item timestamp="2018/4/12" placement="top">
                    <div class="flex items-center gap-4 mb-12">
                        <h4>退款已确认</h4>
                        <p class="text-[#cccccc]">已确认退款到账</p>
                    </div>
                    <el-card>
                        <div class="flex items-center gap-3">凭证:<ImgUpload v-model="dataPage.detail.images"
                                :disabled="true" :isArray="false">
                            </ImgUpload>
                        </div>
                        <div>备注：{{ dataPage.detail.reasonDescription }}</div>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2018/4/3" placement="top">
                    <div class="flex items-center gap-4">
                        <h4>已同意</h4>
                        <p class="text-[#cccccc]">赔付申请已同意，请等待退款到账</p>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </CardModel>
    </div>
    <ConfirmReceiptModel v-model="dataPage.showConfirmReceipt" :curryInfo="dataPage.detail"></ConfirmReceiptModel>
</template>



<style lang="scss" scoped></style>
