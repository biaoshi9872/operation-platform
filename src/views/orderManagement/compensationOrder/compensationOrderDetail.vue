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
        compensateConfirmStatus: Number,//是否可以确认
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
        sendUserInfo: any,
        compensateProgressList: any[]
    },
    showConfirmReceipt: boolean
}

const dataPage = reactive<IData>({
    detail: {
        compensateConfirmStatus: 1,//是否可以确认
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
        sendUserInfo: {},
        //理赔节点
        compensateProgressList: []
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
    //1.获取售后详情
    after_order_api.A_detail({ afterSaleNo, bizType: 2 }).then((res: any) => {
        dataPage.detail = {
            ...dataPage.detail,
            ...res
        }
    })
    //2.节点状态[]
    after_order_api.A_compensatePsrogress({ afterSaleNo, bizType: 2 }).then((res: any) => {
        //理赔节点
        dataPage.detail.compensateProgressList = res || []
    })
}

//售后状态
const statusName = computed(() => {
    return `赔付状态:${order_enum.getAfter_order_statesTitle(dataPage.detail.status + '')}      赔付类型：品质退赔付`
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
        <CardModel iconName="menu-order" :title="`${statusName}`">
            <OrderInfoCell :orderInfo="dataPage.detail"></OrderInfoCell>
        </CardModel>
        <CardModel title="赔付信息">
            <OrderProductCell :orderInfo="dataPage.detail"></OrderProductCell>
        </CardModel>
        <CardModel title="赔付处理详情" v-if="dataPage.detail.compensateProgressList.length > 0">
            <el-timeline style="max-width: 1000px" class="mt-24">
                <el-timeline-item :timestamp="item.operationTime" placement="top" color='#0bbd87'
                    v-for="(item, index) in dataPage.detail.compensateProgressList" :key="index">
                    <div class="flex items-center gap-4 mb-12">
                        <h4>{{ item.flowNodeName }}</h4>
                        <p class="text-[#cccccc]">{{ item.msg }}</p>
                    </div>
                    <el-card v-if="item.images.length > 0">
                        <div class="flex items-center gap-3">凭证:<ImgUpload v-model="item.reasonImages" :disabled="true"
                                :isArray="false">
                            </ImgUpload>
                        </div>
                        <div>备注：{{ item.reasonDescription }}</div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </CardModel>
    </div>
    <ConfirmReceiptModel v-model="dataPage.showConfirmReceipt" :curryInfo="dataPage.detail"></ConfirmReceiptModel>
</template>



<style lang="scss" scoped></style>
