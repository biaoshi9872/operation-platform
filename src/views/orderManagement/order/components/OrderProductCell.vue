<script setup lang="ts">
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import { tabsStore } from '@/stores'
import order_enum from '@/utils/constant/order'
import ApplyRefundModel from '../../components/ApplyRefundModel.vue'
import ApplyTallRefundModel from '../../components/ApplyTallRefundModel.vue'
const { isFromOrgLast, getSystemOptionType } = isStateCheckHooks()
const tabsStoreInfo: any = tabsStore()

interface IProp {
  orderInfo: any
  goodsVOList: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderInfo: {},
  goodsVOList: []
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const goodsTotal = computed(() => {
  return props.goodsVOList?.length || 0
})

const goToDetailHandler = (row: any) => {
  tabsStoreInfo.reload({
    path: '/orderManagement/afterSaleOrder/afterSaleOrderDetail',
    query: {
      afterSaleNo: row.afterSaleNo
    }
  })
}

const goodsList = computed(() => {
  return props.goodsVOList || []
})

const applyRefundHandler = (row: any) => {
  dataInfo.curryInfo = row
  if (props.orderInfo?.channelSource == 63) {
    dataInfo.showApplyTallRefundModel = true
  } else {
    dataInfo.showApplyRefundModel = true
  }
}

const dataInfo = reactive({
  showApplyRefundModel: false,
  showApplyTallRefundModel: false,
  curryInfo: null
})

</script>

<template>
  <div class="table_container">
    <div>
      <el-table style="width: 100%" :data="goodsList" border>
        <el-table-column prop="title" label="商品信息" width="320">
          <template #default="{ row }">
            <div>
              <SkuDetail :customAttribute="{ url: 'images', name: 'skuName', id: 'skuCode' }"
                comboNumName="singleComboNum" width="100%" showGiveawayTagBox="true" :goodDetail="row"
                :style="{ 'height': '83px' }" class="bottom-border-dashed"></SkuDetail>
              <SkuDetail v-for="item in row.orderGiftList" :key="item.skuCode" class="bottom-border-dashed"
                :customAttribute="{ url: 'imageUrl', name: 'skuName', id: 'skuCode' }" comboNumName="singleComboNum"
                width="100%" showGiveawayTagBox="true" :goodDetail="{ ...item, isGift: true }"
                :style="{ 'height': '83px' }"></SkuDetail>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="规格" width="150">
          <template #default="{ row }">
            <AttributeModule :row="row" :parentRow="row" comboNumName="singleComboNum"
              :attributeValue1="row.attributeValue1" :attributeValue2="row.attributeValue2">
            </AttributeModule>
          </template>
        </el-table-column>
        <el-table-column v-if="!isFromOrgLast" prop="platformPurchasePrice" min-width="130" label="平台成本">
          <template #default="{ row }">
            <span>{{ row.isGift ? '-' : `￥${row.platformPurchasePrice}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformSupplyPrice" min-width="150"
          :label="getSystemOptionType == '401' ? '含税供应价' : '平台供应价'">
          <template #default="{ row }">
            <span>{{ row.isGift ? '-' : `￥${row.platformSupplyPrice}` }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" prop="retailPrice"
          min-width="130" label="分销价">
          <template #default="{ row }">
            <span>{{ row.isGift ? '-' : `￥${row.retailPrice}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="数量">
          <template #default="{ row }">
            <div :style="{ height: '80px', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' }"
              class="bottom-border-dashed">{{
                row.goodsNum }}</div>
            <div :style="{ height: '80px', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' }"
              v-for="item in row.orderGiftList" :key="item.skuCode" class="bottom-border-dashed">{{ item.totalNum }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="subAmount" min-width="130" label="小计">
          <template #default="{ row }">
            <span>{{ row.isGift ? '-' : `￥${row.subTotal}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterSaleStatus" min-width="130" label="售后状态">
          <template #default="{ row }">
            <span>{{ row.isGift ? '-' : order_enum.getAfter_order_statesTitle(row.afterSaleStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterSaleType" min-width="130" label="售后类型">
          <template #default="{ row }">
            <span>{{ row.isGift ? '-' : order_enum.getAfterSalesTypeTitle(row.afterSaleType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="right">
          <template #default="{ row }">
            <AuthButton authKey="ORDER_SQSH" v-if="![1, 4].includes(row?.afterSaleStatus) && ![0, 4, 5, -1].includes(orderInfo?.orderBaseInfo?.orderStatus)
              && ![104, 105, 106].includes(orderInfo?.channelSource) && !row.isGift" type="text"
              @click="applyRefundHandler(row)">申请售后
            </AuthButton>
            <el-button v-if="row.afterSaleNo && ![-1, -2].includes(row?.afterSaleStatus)" class="ml-12" type="text"
              @click="goToDetailHandler(row)">查看售后详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer cell_content_box mt8">
      <div>共{{ goodsTotal }}件商品</div>
      <div class="footer-content">
        <span class="item_title">商品金额:</span>
        <span class="item_price">￥{{ orderInfo.totalAmount }}</span>
        <span class="item_title">运费共计:</span>
        <span class="item_price">￥{{ orderInfo.freightAmount }}</span>
        <span class="item_title">订单总金额:</span>
        <span class="item_price">￥{{ orderInfo.orderAmount }}</span>
        <span v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" class="item_title">订单结算总金额:</span>
        <span v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" class="item_price">￥{{
          orderInfo.settlementPrice }}</span>
      </div>
    </div>
  </div>
  <div class="mt-16 table_container">
    <h3 class="mb-8">商品财务信息</h3>
    <el-table style="width: 100%" row-key="rowKey" :data="goodsList" border>
      <YbtTableColumn prop="skuName" label="商品名称" show-overflow-tooltip>
        <template #default="{ row }" class="flex">
          <div class="flex  mb-8  ">
            <OverflowTooltipCell :text="row.skuName">{{ row.skuName }}</OverflowTooltipCell>
          </div>
          <div class="flex mb-8" v-for="item in row.orderGiftList" :key="item.skuCode">
            <TagModel :hasTag="true" :showTag="row.isGift" title="赠"></TagModel>
            <OverflowTooltipCell :text="item.skuName">{{ item.skuName }}</OverflowTooltipCell>
          </div>
        </template>
      </YbtTableColumn>
      <el-table-column prop="date" label="规格">
        <template #default="{ row }">
          <AttributeModule :row="row" comboNumName="singleComboNum" :parentRow="row"
            :attributeValue1="row.attributeValue1" :attributeValue2="row.attributeValue2"></AttributeModule>
        </template>
      </el-table-column>
      <el-table-column prop="skuCode" label="商品编码">
        <template #default="{ row }">
          <div class="mb-8 height-80">{{ row.skuCode ? row.skuCode : '/' }}</div>
          <div class="mb-8 height-80" v-for="item in row.orderGiftList" :key="item.skuCode">{{ item.skuCode ?
            item.skuCode : '/'
            }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="进项税率">
        <template #default="{ row }">{{ order_enum.getDictNameByKey(order_enum.C_taxList, row.tax) }}</template>
      </el-table-column>
      <el-table-column prop="price" label="进项发票类型">
        <template #default="{ row }">{{ order_enum.getDictNameByKey(order_enum.C_invoiceTypeList, row.invoiceType)
          }}</template>
      </el-table-column>
    </el-table>
    <ApplyRefundModel v-model="dataInfo.showApplyRefundModel" :orderInfo="orderInfo" :curryInfo="dataInfo.curryInfo">
    </ApplyRefundModel>
    <ApplyTallRefundModel v-model="dataInfo.showApplyTallRefundModel" :orderInfo="orderInfo"
      :curryInfo="dataInfo.curryInfo">
    </ApplyTallRefundModel>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: dashed 1px #ccc;
  color: $default-text-color;

  .footer-content {
    display: grid;
    grid-template-columns: 160px 1fr;

    .item_title {
      text-align: right;
    }

    .item_price {
      color: $default-title-color;
    }
  }
}

.table_container {
  ::v-deep(.cell_no .cell) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
