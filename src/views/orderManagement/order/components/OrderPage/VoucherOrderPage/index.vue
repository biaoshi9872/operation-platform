<script setup lang="ts">
import order_api from '@/api/order'
import order_enum from '@/utils/constant/order'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import OrderInfoCell from './OrderInfoCell.vue'
import OrderProductCell from './OrderProductCell.vue'
import OrderStateNode from '../../OrderStateNode.vue'
import { buildOrderCopyText, copyText } from '../orderCopy'
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
