<script setup lang="ts">
// import { C_taxList, C_invoiceTypeList, getDictNameByKey } from '@/utils/constant'
import { tabsStore } from '@/stores'
import { getUUID } from '@/utils/tools'
import order_enum from '@/utils/constant/order'
const tabsStoreInfo: any = tabsStore()

interface IProp {
  orderInfo: any
  goodsVOList: any
  financeVOList: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderInfo: {},
  goodsVOList: [],
  financeVOList: []
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
      afterSaleOrderNo: row.afterSaleNo
    }
  })
}

const cellClassHandler = ({ row, column, rowIndex, columnIndex }: any) => {
  if (columnIndex == 0 || column.property == 'title') {
    return 'cell_no'
  }
}

const financeList = computed(() => {
  let level = 0
  transformationLogic(props.financeVOList, level)
  return props.financeVOList
})

const goodsList = computed(() => {
  let level = 0
  transformationLogic(props.goodsVOList, level)
  return props.goodsVOList
})

const transformationLogic = (dataList: any, level: number) => {
  dataList.forEach((item: any) => {
    item.rowKey = getUUID()
    item.level = level
    item.combineTitle = item.title || item.skuName
    //二级商品需要进行名称加工
    if (level == 1) {
      item.combineTitle = item.title || item.skuName
      item.skuCode = ''
    }
    if (item?.comboSkuList) {
      transformationLogic(item.comboSkuList, level + 1)
    }
  })
}

const showGiveawayTagBox = computed(() => {
  return goodsList.value?.some((item: any) => {
    return item.comboSkuList?.some((el: any) => el.giveaway == '2')
  })
})
</script>

<template>
  <div class="table_container">
    <div>
      <el-table
        style="width: 100%"
        :data="goodsList"
        row-key="rowKey"
        border
        :cell-class-name="cellClassHandler"
        :tree-props="{ children: 'comboSkuList', hasChildren: 'hasChildren' }"
      >
        <YbtTableColumn prop="title" label="商品信息" width="320">
          <template #default="{ row }">
            <SkuDetail
              :showExtraCode="true"
              :showGiveawayTagBox="row.level==0 ? false :showGiveawayTagBox"
              :customAttribute="{ url: 'images', name: 'combineTitle', id: 'skuCode' }"
              comboNumName="singleComboNum"
              width="100%"
              :goodDetail="row"
            ></SkuDetail>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="date" label="规格" width="150">
          <template #default="{ row }">
            <AttributeModule
              :row="row"
              :parentRow="row"
              comboNumName="singleComboNum"
              :attributeValue1="row.attributeValue1"
              :attributeValue2="row.attributeValue2"
            ></AttributeModule>
          </template>
        </YbtTableColumn>
        <!-- <YbtTableColumn prop="taxPurchaseCost" min-width="130" label="含税采购成本">
          <template #default="{ row }">
            <span>{{ row.level == 0 ? `￥${row.taxPurchaseCost}`:`￥${row.singleTaxPurchaseCost}` }}</span>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="noTaxPurchaseCost" min-width="150" label="不含税采购成本">
          <template #default="{ row }">
            <span>{{ row.level == 0 ? `￥${row.noTaxPurchaseCost}`:`￥${row.singleNoTaxPurchaseCost}` }}</span>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="supplyPrice" min-width="130" label="含税V链供应价">
          <template #default="{ row }">
            <span>{{row.level == 0 ? `￥${row.supplyPrice}`:`￥${row.singleSupplyPrice}` }}</span>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="noTaxSupplyPrice" min-width="150" label="不含税V链供应价">
          <template #default="{ row }">
            <span>{{ row.level == 0 ? `￥${row.noTaxSupplyPrice}` :`￥${row.singleNoTaxSupplyPrice}`}}</span>
          </template>
        </YbtTableColumn>-->
        <YbtTableColumn prop="goodsNum" label="数量">
          <template #default="{ row }">
            <span>{{ row.level == 0 ? row.goodsNum :row.comboNum }}</span>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="subAmount" min-width="130" label="小计">
          <template #default="{ row }">
            <span>{{ row.level == 0?`￥${row.subAmount}`:`￥${row.supplyPrice}` }}</span>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="currentFlowNodeName" min-width="130" label="售后状态">
          <template #default="{ row }">
            <span>{{ row.level == 0 ? row.currentFlowNodeName : '/' }}</span>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="afterSaleType" min-width="130" label="售后类型">
          <template #default="{ row }">
            <span>{{ row.level == 0 ? row.afterSaleType : '/' }}</span>
          </template>
        </YbtTableColumn>
        <YbtTableColumn label="操作" width="180" align="right">
          <template #default="{ row }">
            <el-button v-if="row.afterSaleNo && row.level == 0" type="text" @click="goToDetailHandler(row)">查看售后详情</el-button>
          </template>
        </YbtTableColumn>
      </el-table>
    </div>
    <div class="footer cell_content_box mt8">
      <div>共{{ goodsTotal }}件商品</div>
      <div class="footer-content">
        <span class="item_title">商品金额:</span>
        <span class="item_price">￥{{ orderInfo.goodsTotalAmount }}</span>
        <span class="item_title">运费共计:</span>
        <span class="item_price">￥{{ orderInfo.freight }}</span>
        <span class="item_title">订单总金额:</span>
        <span class="item_price">￥{{ orderInfo.totalAmount }}</span>
      </div>
    </div>
  </div>
  <div class="mt-16 table_container">
    <h3 class="mb-8">商品财务信息</h3>
    <el-table
      style="width: 100%"
      row-key="rowKey"
      :data="financeList"
      border
      :cell-class-name="cellClassHandler"
      :tree-props="{ children: 'comboSkuList', hasChildren: 'hasChildren' }"
    >
      <YbtTableColumn prop="title" label="商品名称">
        <template #default="{ row }">
          <SkuDetail
            :showOnlyTitle="true"
            :showExtraCode="true"
            :customAttribute="{ url: '', name: 'combineTitle', id: 'skuCode' }"
            width="100%"
            comboNumName="singleComboNum"
            :goodDetail="row"
          ></SkuDetail>
        </template>
      </YbtTableColumn>
      <YbtTableColumn prop="date" label="规格" width="150">
        <template #default="{ row }">
          <AttributeModule
            :row="row"
            comboNumName="singleComboNum"
            :parentRow="row"
            :attributeValue1="row.attributeValue1"
            :attributeValue2="row.attributeValue2"
          ></AttributeModule>
        </template>
      </YbtTableColumn>
      <YbtTableColumn prop="skuCode" label="商品编码">
        <template #default="{ row }">
          <span>{{ row.skuCode ? row.skuCode : '/' }}</span>
        </template>
      </YbtTableColumn>
      <YbtTableColumn prop="tax" label="进项税率">
        <template #default="{ row }">{{ order_enum.getDictNameByKey(order_enum.C_taxList, row.tax) }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop="price" label="进项发票类型">
        <template #default="{ row }">{{ order_enum.getDictNameByKey(order_enum.C_invoiceTypeList, row.invoiceType) }}</template>
      </YbtTableColumn>
    </el-table>
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
    grid-template-columns: 80px 1fr;
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
