<script setup lang="ts">
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import order_api from '@/api/order'
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
const receiverInfo = computed(() => {
  return props.orderInfo.receiverInfo
}) as any
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
  curryInfo: null,
  showRetryDialog: false,
  retryLoading: false,
  retryForm: {
    orderId: '',
    accountNumber: ''
  },
  showReissueDialog: false,
  reissueLoading: false,
  reissueForm: {
    orderId: '',
    accountNumber: ''
  }
})

const retryFormRef = ref<FormInstance>() as any
const reissueFormRef = ref<FormInstance>() as any
const retryRules = reactive<FormRules>({
  accountNumber: [{ required: true, message: '请输入领取账号', trigger: ['blur', 'change'] }]
})

const getRetryOrderId = (row: any) => {
  return props.orderInfo?.orderId
}

const retryHandler = (row: any) => {
  const orderId = getRetryOrderId(row)
  if (!orderId) {
    ElMessage.warning('未获取到订单ID')
    return
  }
  dataInfo.curryInfo = row
  dataInfo.retryForm = {
    orderId: String(orderId),
    accountNumber: receiverInfo.value?.receiverPhone || ''
  }
  dataInfo.showRetryDialog = true
}

const closeRetryDialog = () => {
  if (retryFormRef.value) {
    retryFormRef.value.resetFields()
  }
  dataInfo.retryForm = {
    orderId: '',
    accountNumber: ''
  }
  dataInfo.showRetryDialog = false
}

const closeReissueDialog = () => {
  if (reissueFormRef.value) {
    reissueFormRef.value.resetFields()
  }
  dataInfo.reissueForm = {
    orderId: '',
    accountNumber: ''
  }
  dataInfo.showReissueDialog = false
}

const submitRetry = () => {
  retryFormRef.value.validate().then(() => {
    dataInfo.retryLoading = true
    order_api.A_retry({
      orderId: dataInfo.retryForm.orderId,
      accountNumber: dataInfo.retryForm.accountNumber
    }).then(() => {
      ElMessage.success('操作成功')
      closeRetryDialog()
      searchQueryHandler()
    }).finally(() => {
      dataInfo.retryLoading = false
    })
  })
}

const reissueHandler = (row: any) => {
  const orderId = getRetryOrderId(row)
  if (!orderId) {
    ElMessage.warning('未获取到订单ID')
    return
  }
  ElMessageBox.confirm('该订单已正常生成，请确认是否还需进行补发?', '提醒', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true
  }).then(() => {
    dataInfo.curryInfo = row
    dataInfo.reissueForm = {
      orderId: String(orderId),
      accountNumber: receiverInfo.value?.receiverPhone || ''
    }
    dataInfo.showReissueDialog = true
  }).catch(() => { })
}

const submitReissue = () => {
  reissueFormRef.value.validate().then(() => {
    dataInfo.reissueLoading = true
    order_api.A_reissue({
      orderId: dataInfo.reissueForm.orderId,
      accountNumber: dataInfo.reissueForm.accountNumber
    }).then(() => {
      ElMessage.success('操作成功')
      closeReissueDialog()
      searchQueryHandler()
    }).finally(() => {
      dataInfo.reissueLoading = false
    })
  })
}

</script>

<template>
  <div class="table_container">
    <div>
      <el-table style="width: 100%" :data="goodsList" border>
        <el-table-column prop="title" label="商品信息" width="320">
          <template #default="{ row }">
            <SkuDetail :customAttribute="{ url: 'images', name: 'skuName', id: 'skuCode' }"
              comboNumName="singleComboNum" width="100%" :goodDetail="row" :productSource="orderInfo?.channelSource">
            </SkuDetail>
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
        <el-table-column prop="afterSaleType" min-width="130" label="操作"
          v-if="['101', '201'].includes(getSystemOptionType)">
          <template #default="{ row }">
            <AuthButton auth="ORDER_RETRY" type="primary" v-if="props.orderInfo.orderBaseInfo.orderStatus == -3"
              @click="retryHandler(row)">
              重试
            </AuthButton>
            <AuthButton auth="ORDER_REISSUE" type="primary" v-if="props.orderInfo.orderBaseInfo.orderStatus == 6"
              @click="reissueHandler(row)">补发
            </AuthButton>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer cell_content_box mt8">
      <div>共{{ goodsTotal }}件商品</div>
      <div class="footer-content">
        <span class="item_title">商品金额:</span>
        <span class="item_price">￥{{ orderInfo.totalAmount }}</span>
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
    <el-dialog v-model="dataInfo.showRetryDialog" title="重试" width="500px" append-to-body draggable destroy-on-close
      :close-on-click-modal="false" @closed="closeRetryDialog">
      <el-form ref="retryFormRef" :model="dataInfo.retryForm" :rules="retryRules" label-width="100px">
        <el-form-item label="领取账号" prop="accountNumber" required>
          <el-input v-model="dataInfo.retryForm.accountNumber" maxlength="50" show-word-limit placeholder="请输入领取账号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeRetryDialog">取消</el-button>
          <el-button type="primary" :loading="dataInfo.retryLoading" @click="submitRetry">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dataInfo.showReissueDialog" title="补发" width="500px" append-to-body draggable destroy-on-close
      :close-on-click-modal="false" @closed="closeReissueDialog">
      <el-form ref="reissueFormRef" :model="dataInfo.reissueForm" :rules="retryRules" label-width="100px">
        <el-form-item label="领取账号" prop="accountNumber" required>
          <el-input v-model="dataInfo.reissueForm.accountNumber" disabled maxlength="50" show-word-limit
            placeholder="请输入领取账号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeReissueDialog">取消</el-button>
          <el-button type="primary" :loading="dataInfo.reissueLoading" @click="submitReissue">确认</el-button>
        </div>
      </template>
    </el-dialog>
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
