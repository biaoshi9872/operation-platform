<script setup lang="ts">
import order_api from '@/api/order'
import order_enum from '@/utils/constant/order'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import OrderInfoCell from './OrderInfoCell.vue'
import OrderInfoDetailCell from './OrderInfoDetailCell.vue'
import OrderProductCell from './OrderProductCell.vue'
import OrderStateNode from '../../OrderStateNode.vue'
import { buildOrderCopyText, copyText } from '../orderCopy'

const route = useRoute()
const dataPage: any = reactive({
    detailInfo: {
        goodsInfo: [],
        receiverInfo: {},
        orderBaseInfo: {},
        freightAmount: null,
        remark: '',
        orderStatus: null,
        orderDeliverExpressList: [],
        vpGoodsInfo: []
    },
    activeName: 1,
    failLogVisible: false,
    failLogLoading: false,
    failLogList: [],
    reissueLogVisible: false,
    reissueLogLoading: false,
    reissueLogList: []
})

onMounted(() => {
    init()
})

const init = () => {
    getOrderDetail()
}

const getOrderDetail = () => {
    const { channelOrderNo } = route.query
    order_api.A_getDetail({ channelOrderNo }).then((res: any) => {
        dataPage.detailInfo = {
            ...dataPage.detailInfo,
            ...res
        }
        dataPage.activeName = 0
    })
}

//刷新
provide('searchQueryHandler', init)

const stateTitle = computed(() => {
    return order_enum.getOrder_statesTitle(dataPage.detailInfo.orderBaseInfo.orderStatus)
})

const showFailLogButton = computed(() => {
    return dataPage.detailInfo.failLogView
})

const showReissueLogButton = computed(() => {
    return dataPage.detailInfo.reissueLogView
})

const normalizeList = (res: any) => {
    return res?.list || res?.page?.records || res?.page?.list || res || []
}

const getFailLogOrderId = () => {
    return dataPage.detailInfo?.orderId
}

const getReissueOrderNo = () => {
    return dataPage.detailInfo.orderBaseInfo?.orderNo
}
const openFailLogDialog = () => {
    const orderId = getFailLogOrderId()
    if (!orderId) {
        ElMessage.warning('未获取到订单ID')
        return
    }
    dataPage.failLogVisible = true
    dataPage.failLogLoading = true
    order_api.A_queryFailLog(String(orderId)).then((res: any) => {
        dataPage.failLogList = normalizeList(res)
    }).finally(() => {
        dataPage.failLogLoading = false
    })
}

const openReissueLogDialog = () => {
    const orderNo = getReissueOrderNo()
    if (!orderNo) {
        ElMessage.warning('未获取到订单编号')
        return
    }
    dataPage.reissueLogVisible = true
    dataPage.reissueLogLoading = true
    order_api.A_queryPartLog(String(orderNo)).then((res: any) => {
        dataPage.reissueLogList = normalizeList(res)
    }).finally(() => {
        dataPage.reissueLogLoading = false
    })
}

const getReissueStatus = (status: string | number) => {
    if (String(status) === '1') {
        return '成功'
    }
    if (String(status) === '-1') {
        return '失败'
    }
    return status || '-'
}

const copyOrderHandler = async () => {
    try {
        await copyText(buildOrderCopyText(dataPage.detailInfo))
        ElMessage.success('复制成功')
    } catch (error) {
        ElMessage.error('复制失败')
    }
}

</script>

<template>
    <CardModel title="订单详情">
        <template #option>
            <el-button type="primary" @click="copyOrderHandler">一键复制</el-button>
        </template>
        <OrderStateNode></OrderStateNode>
    </CardModel>
    <CardModel iconName="menu-order" :title="`订单状态:${stateTitle}`">
        <template #option>
            <el-button v-if="showFailLogButton" type="primary" link @click="openFailLogDialog">查看失败记录</el-button>
            <el-button v-if="showReissueLogButton" type="primary" link @click="openReissueLogDialog">查看补发记录</el-button>
        </template>
        <OrderInfoCell :orderBaseInfo="dataPage.detailInfo.orderBaseInfo" :orderInfo="dataPage.detailInfo">
        </OrderInfoCell>
    </CardModel>
    <CardModel title="详细信息">
        <OrderInfoDetailCell :orderBaseInfo="dataPage.detailInfo.orderBaseInfo" :orderInfo="dataPage.detailInfo">
        </OrderInfoDetailCell>
    </CardModel>
    <CardModel title="备注信息">
        <div class="content_box">
            <div class="item">
                <span class="item_title">订单备注:</span>
                <span class="item_value">{{ dataPage.detailInfo.remark }}</span>
            </div>
        </div>
    </CardModel>
    <CardModel title="商品信息">
        <OrderProductCell :orderInfo="dataPage.detailInfo" :goodsVOList="dataPage.detailInfo.goodsInfo">
        </OrderProductCell>
    </CardModel>
    <el-dialog v-model="dataPage.failLogVisible" title="失败记录" width="1300px" append-to-body draggable destroy-on-close>
        <el-table :data="dataPage.failLogList" border v-loading="dataPage.failLogLoading" max-height="460">
            <el-table-column prop="submitTime" label="提交订单时间" min-width="150" show-overflow-tooltip />
            <el-table-column prop="confirmTime" label="确认下单时间" min-width="150" show-overflow-tooltip />
            <el-table-column prop="orderNo" label="订单编号" min-width="140" show-overflow-tooltip />
            <el-table-column prop="channelOrderNo" label="供应商订单编号" min-width="150" show-overflow-tooltip />
            <el-table-column prop="thirdOrderNo" label="第三方订单编号" min-width="160" show-overflow-tooltip />
            <el-table-column prop="thirdBatchNo" label="批次号" min-width="110" show-overflow-tooltip />
            <el-table-column prop="receiverPhone" label="领取账号" min-width="130" show-overflow-tooltip />
            <el-table-column prop="errMsg" label="失败原因" min-width="140" show-overflow-tooltip />
        </el-table>
    </el-dialog>
    <el-dialog v-model="dataPage.reissueLogVisible" title="补发记录" width="1300px" append-to-body draggable
        destroy-on-close>
        <el-table :data="dataPage.reissueLogList" border v-loading="dataPage.reissueLogLoading" max-height="460">
            <el-table-column prop="submitTime" label="提交订单时间" min-width="130" show-overflow-tooltip />
            <el-table-column prop="confirmTime" label="确认下单时间" min-width="130" show-overflow-tooltip />
            <el-table-column prop="reissueOrderNo" label="补发单编号" min-width="150" show-overflow-tooltip />
            <el-table-column prop="channelOrderNo" label="供应商订单编号" min-width="150" show-overflow-tooltip />
            <el-table-column prop="thirdOrderNo" label="第三方订单编号" min-width="160" show-overflow-tooltip />
            <el-table-column prop="thirdBatchNo" label="批次号" min-width="110" show-overflow-tooltip />
            <el-table-column prop="accountNumber" label="领取账号" min-width="130" show-overflow-tooltip />
            <el-table-column prop="errMsg" label="失败原因" min-width="140" show-overflow-tooltip>
                <template #default="{ row }">
                    {{ row.errMsg || '-' }}
                </template>
            </el-table-column>
            <el-table-column label="补发状态" min-width="110" show-overflow-tooltip>
                <template #default="{ row }">
                    {{ getReissueStatus(row.status) }}
                </template>
            </el-table-column>
            <el-table-column prop="createName" label="操作人" min-width="110" show-overflow-tooltip />
            <el-table-column prop="createTime" label="操作时间" min-width="150" show-overflow-tooltip />
        </el-table>
    </el-dialog>
</template>
<style lang="scss" scoped>
.content_box {
    @include grid_content_box(3);
}

.card_container {
    background-color: #f5f7fa;
    margin-bottom: 12px;
    padding: 12px;
}
</style>
