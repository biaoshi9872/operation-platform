<script setup lang="ts">
import order_api from '@/api/order'
import order_enum from '@/utils/constant/order'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import OrderInfoCell from '../OrderInfoCell.vue'
import OrderLogisticCell from '../OrderLogisticCell.vue'
import OrderProductCell from '../OrderProductCell.vue'
import OrderStateNode from '../OrderStateNode.vue'
import goodPoor_enum from '@/utils/constant/goodPoor'
import { buildOrderCopyText, copyText } from './orderCopy'
const route = useRoute()
const dataPage = reactive({
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
    activeName: 1
})

onMounted(() => {
    init()
})

const init = () => {
    getOrderDetail()
}

const getOrderLogistic = () => {
    const { channelOrderNo } = dataPage.detailInfo.orderBaseInfo as any
    order_api.A_orderQueryTrace({ channelOrderNo }).then((res: any) => {
        dataPage.detailInfo.orderDeliverExpressList = res || []
    })
}
const getOrderDetail = () => {
    const { channelOrderNo } = route.query
    order_api.A_getDetail({ channelOrderNo }).then((res: any) => {
        dataPage.detailInfo = {
            ...dataPage.detailInfo,
            ...res
        }
        dataPage.activeName = 0
        //不需要显示物流
        if (![107].includes(dataPage.detailInfo.channelSource)) {
            getOrderLogistic()
        }

    })
}

//刷新
provide('searchQueryHandler', init)

const stateTitle = computed(() => {
    return order_enum.getOrder_statesTitle(dataPage.detailInfo.orderBaseInfo.orderStatus)
})

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
        <OrderInfoCell :orderBaseInfo="dataPage.detailInfo.orderBaseInfo" :orderInfo="dataPage.detailInfo">
        </OrderInfoCell>
    </CardModel>
    <CardModel v-if="dataPage.detailInfo.orderType == 1" title="详细信息">
        <div class=" content_box  " :class="dataPage.detailInfo.vpGoodsInfo.length > 1 ? 'card_container' : ''"
            v-for="(item, index) in dataPage.detailInfo.vpGoodsInfo">
            <div class="item">
                <span class="item_title">产品名称:</span>
                <span class="item_value">{{ item.goodsName }}
                </span>
            </div>
            <div class="item">
                <span class="item_title">产品属性:</span>
                <span class="item_value">{{ goodPoor_enum.getVpProductTypeNameByKey(item.productType)
                }}</span>
            </div>
            <div class="item">
                <span class="item_title">券码:</span>
                <span class="item_value">{{ item.cardNo }}</span>
            </div>
            <div class="item">
                <span class="item_title">有效期开始时间:</span>
                <span class="item_value">{{ item.expirationStartDate || '-' }}</span>
            </div>
            <div class="item">
                <span class="item_title">有效期结束时间:</span>
                <span class="item_value">{{ item.expirationEndDate || '-' }}</span>
            </div>
            <div class="item">
                <span class="item_title">账号:</span>
                <span class="item_value">{{ item.accountNumber }}</span>
            </div>
        </div>
    </CardModel>
    <CardModel v-if="dataPage.detailInfo.orderType != 1" title="收货信息">
        <div class="content_box">
            <div class="item">
                <span class="item_title">收货人:</span>
                <span class="item_value">{{ dataPage.detailInfo.receiverInfo.receiverName }}</span>
            </div>
            <div class="item">
                <span class="item_title">收货人手机号:</span>
                <span class="item_value">{{ dataPage.detailInfo.receiverInfo.receiverPhone }}</span>
            </div>
            <div class="item">
                <span class="item_title">收货地址:</span>
                <span class="item_value">
                    {{ dataPage.detailInfo.receiverInfo.address }}
                </span>
            </div>
        </div>
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
    <CardModel v-if="dataPage.detailInfo.orderType != 1" title="发货信息">
        <OrderLogisticCell v-model:active="dataPage.activeName" :orderInfo="dataPage.detailInfo"
            :orderDeliverVOList="dataPage.detailInfo.orderDeliverExpressList"></OrderLogisticCell>
    </CardModel>
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
