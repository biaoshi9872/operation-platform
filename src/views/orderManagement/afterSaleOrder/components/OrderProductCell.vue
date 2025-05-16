<script setup lang="ts">
import { useRoute } from 'vue-router'
// import { A_queryAfterSaleOrderGoodsInfo } from '@/api/orderManger'
// import { C_taxList, C_invoiceTypeList, getDictNameByKey } from '@/utils/constant'
import { getUUID } from '@/utils/tools'
import order_enum from '@/utils/constant/order'
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
const supplierAfterSalePrice = computed(() => {
  const totalPrice = dataPage.goodsList?.reduce((total: any, cur: any) => {
    return (total += cur.supplierAfterSalePrice)
  }, 0)
  return totalPrice
})

const purchaseAfterSalePrice = computed(() => {
  const totalPrice = dataPage.goodsList?.reduce((total: any, cur: any) => {
    return (total += cur.purchaseAfterSalePrice)
  }, 0)
  return totalPrice
})

const dataPage = reactive({
  goodsList: []
})

onMounted(() => {
  getOperationLog()
})

//节点状态
const getOperationLog = () => {
  const { afterSaleOrderNo } = route.query
  // A_queryAfterSaleOrderGoodsInfo({ afterSaleOrderNo }).then((res: any) => {
  //   dataPage.goodsList = [res] as any
  // })
}

const cellClassHandler = ({ row, column, rowIndex, columnIndex }: any) => {
  if (columnIndex == 0 || column.property == 'title') {
    return 'cell_no'
  }
}

const goodsList = computed(() => {
  let level = 0
  transformationLogic(dataPage.goodsList, level)
  return dataPage.goodsList
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
    <div class="content_box mb-24">
      <div class="item">
        <span class="item_title">售后类型:</span>
        <span class="item_value">{{ orderInfo.afterSaleTypeName }}</span>
      </div>
      <div class="item">
        <span class="item_title">{{ `${afterSaleTypeName}原因` }}:</span>
        <span class="item_value">{{ orderInfo.reasonName }}</span>
      </div>
      <div class="item" v-if="['2', '3', '4'].includes(String(orderInfo.afterSaleType))">
        <span class="item_title">{{ `退款金额（分销价）` }}:</span>
        <span class="item_value">{{ `￥${supplierAfterSalePrice}` }}</span>
      </div>
      <div class="item" v-if="['2', '3', '4'].includes(String(orderInfo.afterSaleType))">
        <span class="item_title">{{ `退款金额(供应价)` }}:</span>
        <span class="item_value">{{ `￥${purchaseAfterSalePrice}` }}</span>
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
                :goodDetail="row"
                :showExtraCode="true"
                comboNumName="singleComboNum"
                :showGiveawayTagBox="row.level==0 ? false :showGiveawayTagBox"
                :customAttribute="{ url: 'images', name: 'combineTitle', id: 'skuCode' }"
                width="100%"
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
          <YbtTableColumn prop="taxPurchaseCost" min-width="130" label="平台成本">
            <template #default="{ row }">
              <span>{{ row.level == 0 ? `￥${row.taxPurchaseCost}`:`￥${row.singleTaxPurchaseCost}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="noTaxPurchaseCost" min-width="150" label="平台供应价">
            <template #default="{ row }">
              <span>{{ row.level == 0 ? `￥${row.noTaxPurchaseCost}`:`￥${row.singleNoTaxPurchaseCost}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="supplyPrice" min-width="130" label="分销价">
            <template #default="{ row }">
              <span>{{row.level == 0 ? `￥${row.supplyPrice}`:`￥${row.singleSupplyPrice}` }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="totalNum" label="数量">
            <template #default="{ row }">
              <span>{{ row.level == 0 ? `${row.totalNum}`:`${row.comboNum}`}}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn prop="afterSaleNum" min-width="120" label="售后数量">
            <template #default="{ row }">
              <span>{{row.level==0 ? `${row.afterSaleNum}`:'/' }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn v-if="!['1'].includes(String(orderInfo.afterSaleType))" align="left" prop="freightAmount" label="运费">
            <template #header>
              <Tooltip content="售后审核后，将会根据实际情况更新售后运费字段值">
                <span>运费</span>
              </Tooltip>
            </template>
            <template #default="{ row }">
              <span>{{ row.level==0 ? (orderInfo.currentFlowNodeCode == 1 ? `￥${row.freightAmount || 0}`:'-') :'/'}}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn
            v-if="!['1'].includes(String(orderInfo.afterSaleType))"
            width="160"
            prop="supplierAfterSalePrice"
            label="退款金额(成本)"
          >
            <template #default="{ row }">
              <span>{{ row.level==0 ?`￥${row.supplierAfterSalePrice}`:'/' }}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn
            v-if="!['1'].includes(String(orderInfo.afterSaleType))"
            width="160"
            prop="purchaseAfterSalePrice"
            label="退款金额(供应价)"
          >
            <template #default="{ row }">
              <span>{{row.level==0 ?`￥${row.purchaseAfterSalePrice}` :'/'}}</span>
            </template>
          </YbtTableColumn>
          <YbtTableColumn
            v-if="!['1'].includes(String(orderInfo.afterSaleType))"
            width="160"
            prop="purchaseAfterSalePrice"
            label="退款金额(分销价)"
          >
            <template #default="{ row }">
              <span>{{row.level==0 ?`￥${row.purchaseAfterSalePrice}` :'/'}}</span>
            </template>
          </YbtTableColumn>
        </el-table>
      </div>
      <h4 class="mb-16 mt-16">商品财务信息</h4>
      <el-table
        style="width: 100%"
        :data="dataPage.goodsList"
        border
        row-key="rowKey"
        :cell-class-name="cellClassHandler"
        :tree-props="{ children: 'comboSkuList', hasChildren: 'hasChildren' }"
      >
        <YbtTableColumn prop="combineTitle" label="商品名称">
          <template #default="{ row }">
            <SkuDetail
              :showGiveawayTagBox="row.level==0 ? false :showGiveawayTagBox"
              :customAttribute="{ url: 'images', name: 'combineTitle', id: 'skuCode' }"
              width="100%"
              :showExtraCode="true"
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
