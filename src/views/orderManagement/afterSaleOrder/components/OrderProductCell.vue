<script setup lang="ts">
import { useRoute } from 'vue-router'

import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import order_enum from '@/utils/constant/order'
const { isFromOrgLast, getSystemOptionType } = isStateCheckHooks()
const route = useRoute()
interface IProp {
  orderInfo?: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
const afterSaleTypeName = inject('afterSaleTypeName', () => '')

const afterSaleGoodsVO = computed(() => {
  if (props.orderInfo.afterSaleGoodsVO) {
    return [props.orderInfo.afterSaleGoodsVO]
  }
  return []
})

</script>

<template>

  <div class="table_container">
    <div class="content_box mb-24">
      <div class="item">
        <span class="item_title">售后类型:</span>
        <span class="item_value">{{ afterSaleTypeName }}</span>
      </div>
      <div class="item">
        <span class="item_title">{{ `${afterSaleTypeName}原因` }}:</span>
        <span class="item_value">{{ orderInfo.reasonName }}</span>
      </div>
      <div class="item" v-if="['2', '3', '4'].includes(String(orderInfo.afterSaleType))">
        <span class="item_title">{{ `退款金额（分销价）` }}:</span>
        <span class="item_value">{{ `￥${orderInfo.afterSaleGoodsVO.retailPrice}` }}</span>
      </div>
      <div class="item" v-if="['2', '3', '4'].includes(String(orderInfo.afterSaleType))">
        <span class="item_title">{{ `退款金额(供应价)` }}:</span>
        <span class="item_value">{{ `￥${orderInfo.afterSaleGoodsVO.afterSaleSupplyPrice}` }}</span>
      </div>
      <div class="item flex">
        <span class="item_title">{{ `${afterSaleTypeName}说明` }}:</span>
        <span class="item_value">
          <span>{{ orderInfo.reasonDescription }}</span>
          <div v-if="orderInfo.images">
            <ImgUpload v-model="orderInfo.images" :disabled="true" :isArray="false"></ImgUpload>
          </div>
        </span>
      </div>
    </div>
    <div>
      <div class="sku_box">
        <h4 class="mb-16">商品信息</h4>
        <el-table style="width: 100%" :data="afterSaleGoodsVO" border>
          <YbtTableColumn prop="title" label="商品信息" width="320">
            <template #default="{ row }">
              <SkuDetail :goodDetail="row" comboNumName="singleComboNum"
                :customAttribute="{ url: 'images', name: 'skuName', id: 'skuCode' }" width="100%"></SkuDetail>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="date" label="规格" width="150">
            <template #default="{ row }">
              <AttributeModule :row="row" comboNumName="singleComboNum" :parentRow="row" :attributeValue1="row.spec"
                :attributeValue2="row.attributeValue2"></AttributeModule>
            </template>
          </YbtTableColumn>
          <YbtTableColumn v-if="!isFromOrgLast" prop="platformPurchasePrice" min-width="130" label="平台成本">
            <template #default="{ row }">
              <span>{{ `￥${row.platformPurchasePrice}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="platformSupplyPrice" min-width="150" label="平台供应价">
            <template #default="{ row }">
              <span>{{ `￥${row.platformSupplyPrice}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="retailPrice" min-width="130" label="分销价">
            <template #default="{ row }">
              <span>{{ `￥${row.retailPrice}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="goodsNum" label="数量">
            <template #default="{ row }">
              <span>{{ `${row.goodsNum ?? '-'} ` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="afterSaleNum" min-width="120" label="售后数量">
            <template #default="{ row }">
              <span>{{ `${row.afterSaleNum ?? '-'}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn v-if="!['1'].includes(String(orderInfo.afterSaleType))" align="left" prop="freightAmount"
            label="运费">
            <template #header>
              <Tooltip content="售后审核后，将会根据实际情况更新售后运费字段值">
                <span>运费</span>
              </Tooltip>
            </template>
            <template #default="{ row }">
              <span>{{ row.freightAmount ?? '-' }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn
            v-if="!['1'].includes(String(orderInfo.afterSaleType)) && ['101'].includes(getSystemOptionType)" width="160"
            prop="supplierAfterSalePrice" label="退款金额(成本)">
            <template #default="{ row }">
              <span>{{ row.afterSalePurchasePrice ?? '-' }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn
            v-if="!['1'].includes(String(orderInfo.afterSaleType)) && ['101', '201'].includes(getSystemOptionType)"
            width="160" prop="afterSaleSupplyPrice" label="退款金额(供应价)">
            <template #default="{ row }">
              <span>{{ row.afterSaleSupplyPrice ?? '-' }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn
            v-if="!['1'].includes(String(orderInfo.afterSaleType)) && ['101', '201'].includes(getSystemOptionType)"
            width="160" prop="afterSaleRetailPrice" label="退款金额(分销价)">
            <template #default="{ row }">
              <span>{{ row.afterSaleRetailPrice ?? '-' }}</span>
            </template>
          </YbtTableColumn>
        </el-table>
      </div>
      <h4 class="mb-16 mt-16">商品财务信息</h4>
      <el-table style="width: 100%" :data="afterSaleGoodsVO" border>
        <YbtTableColumn prop="skuName" label="商品名称" show-overflow-tooltip>
        </YbtTableColumn>
        <YbtTableColumn prop="date" label="规格" width="150">
          <template #default="{ row }">
            <AttributeModule :row="row" comboNumName="singleComboNum" :parentRow="row" :attributeValue1="row.spec"
              :attributeValue2="row.attributeValue2"></AttributeModule>
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
          <template #default="{ row }">{{ order_enum.getDictNameByKey(order_enum.C_invoiceTypeList, row.invoiceType)
          }}</template>
        </YbtTableColumn>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}

.sku_box {
  padding-bottom: 24px;
  border-bottom: dashed 1px #ccc;
}

.table_container {
  ::v-deep(.cell_no .cell) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
