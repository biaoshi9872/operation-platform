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
        <span class="item_title">赔付原因:</span>
        <span class="item_value">{{ orderInfo.reasonName }}</span>
      </div>
      <div class="item flex">
        <span class="item_title">凭证:</span>
        <span class="item_value">
          <div v-if="orderInfo.images">
            <ImgUpload v-model="orderInfo.images" :disabled="true" :isArray="false"></ImgUpload>
          </div>
        </span>
      </div>
      <div class="item">
        <span class="item_title">备注:</span>
        <span class="item_value">{{ orderInfo.reasonDescription }}</span>
      </div>
      <div class="item">
        <span class="item_title">赔付金额:</span>
        <span class="item_value">{{ `￥${orderInfo.afterSaleRetailPrice ?? '-'}` }}</span>
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
          <YbtTableColumn prop="date" label="规格">
            <template #default="{ row }">
              <AttributeModule :row="row" comboNumName="singleComboNum" :parentRow="row"
                :attributeValue1="row.attributeValue1" :attributeValue2="row.attributeValue2"></AttributeModule>
            </template>
          </YbtTableColumn>
          <YbtTableColumn v-if="!isFromOrgLast" prop="platformPurchasePrice" min-width="130" label="平台成本">
            <template #default="{ row }">
              <span>{{ `￥${row.platformPurchasePrice ?? '-'}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" prop="retailPrice"
            min-width="130" label="分销价">
            <template #default="{ row }">
              <span>{{ `￥${row.retailPrice ?? '-'}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="afterSaleNum" min-width="120" label="售后数量">
            <template #default="{ row }">
              <span>{{ `${row.afterSaleNum ?? '-'}` }}</span>
            </template>
          </YbtTableColumn>
        </el-table>
      </div>
      <h4 class="mb-16 mt-16">商品财务信息</h4>
      <el-table style="width: 100%" :data="afterSaleGoodsVO" border>
        <YbtTableColumn prop="skuName" label="商品名称" show-overflow-tooltip>
        </YbtTableColumn>
        <YbtTableColumn prop="date" label="规格">
          <template #default="{ row }">
            <AttributeModule :row="row" comboNumName="singleComboNum" :parentRow="row"
              :attributeValue1="row.attributeValue1" :attributeValue2="row.attributeValue2"></AttributeModule>
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

.item_title {
  min-width: 150px;
}

.table_container {
  ::v-deep(.cell_no .cell) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
