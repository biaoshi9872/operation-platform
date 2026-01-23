<script setup lang="ts">
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import order_enum from '@/utils/constant/order'
import virtualCardPackProduct_enum from '@/utils/constant/virtualCardPackProduct'
import VirtualRechargeModel from '../../../../components/VirtualRechargeModel.vue'
const { isFromOrgLast, getSystemOptionType } = isStateCheckHooks()

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
const searchQueryHandler = inject('searchQueryHandler', () => { })

const goodsList = computed(() => {
  let list: any = []
  props.goodsVOList?.forEach((item: any) => {
    const newItem = { ...item }
    let arr = aggregate(item.goodsCouponInfo, newItem.rowKey)
    newItem.children = arr
    if (!arr || arr.length === 0) {
      newItem.hasChildren = false
    }
    list.push(newItem)
  })
  return list || []
})

const aggregate = (list: any, parentKey: any) => {
  if (!list || !list.length) return []
  const map: any = {};
  for (const item of list) {
    const k = item.couponSkuCode;
    if (!map[k]) {
      map[k] = { skuCode: k, skuName: item.couponSkuName, count: 0, tax: item.taxRate, invoiceType: item.invoiceType };
    }
    map[k].count += 1;
  }
  return Object.values(map).map((item: any, index: number) => {
    return {
      ...item,
      skuName: item.skuName + ' * ' + item.count,
      rowKey: (parentKey ? parentKey + '_' : '') + (item.skuCode || 'child') + '_' + index,
      children: undefined,
      hasChildren: false
    }
  });
};

const dataInfo = reactive({
  showVirtualRechargeModel: false,
  curryInfo: null
})

const retryHandler = (row: any) => {
  dataInfo.curryInfo = row
  dataInfo.showVirtualRechargeModel = true
}


</script>

<template>
  <div class="table_container">
    <div>
      <el-table style="width: 100%" :data="goodsList" border>
        <el-table-column prop="title" label="商品信息" width="320">
          <template #default="{ row }">
            <SkuDetail :customAttribute="{ url: 'images', name: 'skuName', id: 'skuCode' }"
              comboNumName="singleComboNum" width="100%" :goodDetail="row"></SkuDetail>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="规格" min-width="100">
          <template #default="{ row }">
            <div class="flex flex-col " v-if="row.species?.length">
              <div v-for="item in row.species">
                {{ item }}
              </div>
            </div>
            <div v-else>
              <span>-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="!isFromOrgLast" prop="platformPurchasePrice" min-width="130" label="平台成本">
          <template #default="{ row }">
            <span>{{ `￥${row.platformPurchasePrice}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformSupplyPrice" min-width="150"
          :label="getSystemOptionType == '401' ? '含税供应价' : '平台供应价'">
          <template #default="{ row }">
            <span>{{ `￥${row.platformSupplyPrice}` }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" prop="retailPrice"
          min-width="130" label="分销价">
          <template #default="{ row }">
            <span>{{ `￥${row.retailPrice}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="数量">
          <template #default="{ row }">
            <span>{{ row.goodsNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subAmount" min-width="130" label="小计">
          <template #default="{ row }">
            <span>{{ `￥${row.subTotal}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterSaleStatus" min-width="130" label="售后状态">
          <template #default="{ row }">
            <span>{{ order_enum.getAfter_order_statesTitle(row.afterSaleStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterSaleType" min-width="130" label="售后类型">
          <template #default="{ row }">
            <span>{{ order_enum.getAfterSalesTypeTitle(row.afterSaleType) }}</span>
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
    <el-table style="width: 70%" row-key="rowKey" :data="goodsList" border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :default-expand-all="true">
      <el-table-column prop="skuName" label="商品名称" :show-overflow-tooltip="true" min-width="150">
      </el-table-column>
      <el-table-column prop="date" label="规格" min-width="100">
        <template #default="{ row }">
          <div class="flex flex-col " v-if="row.species?.length">
            <div v-for="item in row.species">
              {{ item }}
            </div>
          </div>
          <div v-else>
            <span>-</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skuCode" label="商品编码" min-width="150">
        <template #default="{ row }">
          <span>{{ row.skuCode ? row.skuCode : '/' }}</span>
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
    <VirtualRechargeModel v-model="dataInfo.showVirtualRechargeModel" :orderInfo="orderInfo"
      :curryInfo="dataInfo.curryInfo" :packageKey="orderInfo.orderBaseInfo.packageKey" @refresh="searchQueryHandler">
    </VirtualRechargeModel>
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
