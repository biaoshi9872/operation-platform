<script setup lang='ts'>
defineOptions({ name: 'orderList' })
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import SkuDetail from '@/components/SkuDetail/index.vue'
// import {
//   A_getAfterOrderList,
//   A_confirmRefund,
//   A_afterSaleOrderOperationExport,
//   A_confirmReceiveAndRefund,
//   A_userConfirmReceive,
//   A_confirmReceive
// } from '@/api/orderManger'
import { ElButton } from 'element-plus'
import { ref, resolveDirective, withDirectives } from 'vue'
// import { AFTERSALETYPES, AFTERSALESTATELIST, getDictNameByKey } from '@/utils/constant'
import order_enum from '@/utils/constant/order'
import goodPoor from '@/utils/constant/goodPoor'
import { tabsStore } from '@/stores'
import { ElMessageBox, ElMessage } from 'element-plus'
import useTCache from '@/hooks/cacheHooks'
import StateCell from '@/components/Tooltip/StateCell.vue'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { getSystemConfigInfoByKey } = useTCache()
const { isFromOrgLast } = isStateCheckHooks()
const tabsStoreInfo: any = tabsStore()
const $route = useRoute()
const authDir = resolveDirective('auth')

const routeConversion = () => {
  const { query } = $route
  if (query) {
    dataPage.facade.currentFlowNodeCode = query.currentFlowNodeCode ? query.currentFlowNodeCode?.split(',').map((el: any) => el + '') : []
  }
}
const dataPage: IPage<any, any> = reactive({
  selectPage: null,
  defaultValueConversion: routeConversion,
  toDownloadCenterApi: null,
  dataList: [],
  multipleList: [],
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  isOnload: false,
  facade: {
    afterSaleType: [], //售后类型
    applyStartTime: '', //申请时间(开始)
    applyEndTime: '', ////申请时间(结束)
    afterSaleOrderCode: '', //售后单边
    currentFlowNodeCode: [], //售后状态
    skuName: '', //商品名称
    skuCode: '', //商品编码
    payOrderCode: '', //支付编码
    thirdOrderNo: '',
    merchantNo: [], //分销商
    channelCodeListModel: null,
    desensitizationStatus: null,
    supplyId: [] //供应商编码
  },
  facadeKz: {
    activeName: '1'
  },
  curryInfo: null
})
onActivated(() => {
  routeConversion()
  watch(
    () => dataPage.facade.currentFlowNodeCode,
    () => {
      searchQueryHarder()
    }
  )
})
const { pagingQuery, searchQuery, toDownloadCenter } = pageHooks(dataPage)

const exportHandler = () => {
  const obj = getQueryParams()
  toDownloadCenter({ ...obj })
}

// 查询回调
const getQueryParams = () => {
  const { page, facade } = dataPage
  return { ...page, ...facade }
}

// 查询回调
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}

// 分页回调
const pagingQueryHarder = () => {
  const obj = getQueryParams()
  pagingQuery(obj)
}
const toDetailHandler = (row: any) => {
  tabsStoreInfo.reload({
    path: '/orderManagement/afterSaleOrder/afterSaleOrderDetail',
    query: {
      afterSaleOrderNo: row.afterSaleNo
    }
  })
}
const columns: any = ref([])
onMounted(() => {
  initColumns()
})
const initColumns = () => {
  columns.value = []
  columns.value.push({
    width: '120px',
    label: '是否脱敏发货',
    align: 'center',
    render: (row: any, column: any, index: any, parentRow: any) => {
      const title = parentRow?.desensitizationStatus === 1 ? '是' : '否'
      return h(StateCell, { title: title, isTrueState: parentRow?.desensitizationStatus == 1 })
    }
  })
  columns.value.push({
    width: '120px',
    label: '是否脱敏发货',
    align: 'center',
    render: (row: any, column: any, index: any, parentRow: any) => {
      const title = parentRow?.desensitizationStatus === 1 ? '是' : '否'
      return h(StateCell, { title: title, isTrueState: parentRow?.desensitizationStatus == 1 })
    }
  })
  columns.value.push({
    label: '商品信息',
    prop: '1',
    width: '300px',
    align: 'left',
    render: (row: any, props: any) => {
      let newRow = row
      newRow.titleSpec = row.skuName + ' ' + (row.spec || '')
      return h(SkuDetail, {
        goodDetail: newRow,
        showExtraCode: true,
        customAttribute: {
          url: 'skuImage',
          name: 'titleSpec',
          id: 'skuCode'
        },
        width: '100%',
        curryPropInfo: props
      })
    }
  })
  columns.value.push({
    label: '售后数量',
    align: 'center',
    width: '100px',
    prop: 'afterSaleNum'
  })
  if (!isFromOrgLast.value) {
    columns.value.push({
      label: '平台成本',
      prop: 'taxPurchaseCost',
      align: 'center',
      width: '130px',
      render: (row: any) => {
        return h('div', `￥${row.taxPurchaseCost ?? ''}`)
      }
    })
  }
  columns.value.push({
    label: '平台供应价',
    align: 'center',
    width: '130px',
    prop: 'supplyPrice',
    render: (row: any) => {
      return h('div', `￥${row.supplyPrice ?? ''}`)
    }
  })
  columns.value.push({
    label: '分销价',
    align: 'center',
    width: '130px',
    prop: 'supplyPrice',
    render: (row: any) => {
      return h('div', `￥${row.supplyPrice ?? ''}`)
    }
  })
  columns.value.push({
    label: '销售单位',
    align: 'center',
    width: '100px',
    prop: 'unit'
  })
  columns.value.push({
    label: '商品类型',
    align: 'center',
    width: '100px',
    prop: 'unit',
    render: (row: any) => {
      return h('div', goodPoor.getSourceTypeNameByKey(row.sourceType))
    }
  })
  columns.value.push({
    label: '售后类型',
    align: 'center',
    width: '100px',
    prop: 'afterSaleTypeName'
  })

  columns.value.push({
    label: '售后状态',
    align: 'center',
    prop: 'currentFlowNodeName'
  })
  columns.value.push({
    label: '操作',
    align: 'center',
    render: (row: any) => {
      const detailButton = h(ElButton, {
        type: 'text',
        innerText: '详情',
        onClick: () => {
          toDetailHandler(row)
        }
      })
      const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
      return h('div', { style }, [detailButton])
    }
  })
}
</script>

<template>
  <PageContainer v-loading="dataPage.loadingData">
    <SearchForm
      v-model:model="dataPage.facade"
      v-model:current-page="dataPage.page.page"
      class="el-search-item"
      @search="searchQueryHarder"
    >
      <el-form-item label="售后类型" class="formItem">
        <SelectModel v-model.trim="dataPage.facade.afterSaleType" :selectList="order_enum.AfterSalesType"></SelectModel>
      </el-form-item>
      <el-form-item label="售后状态" class="formItem">
        <SelectModel v-model.trim="dataPage.facade.currentFlowNodeCode" :multiple="true" :selectList="order_enum.after_order_states"></SelectModel>
      </el-form-item>
      <el-form-item label="申请时间" class="el-form-item-inputGroup">
        <DatePickerRange v-model:start="dataPage.facade.applyStartTime" v-model:end="dataPage.facade.applyEndTime"></DatePickerRange>
      </el-form-item>
      <el-form-item label="售后单编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.afterSaleOrderCode" placeholder="请输入售后单编号"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.skuName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="订单编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.payOrderCode" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item label="商品编码" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.skuCode" placeholder="请输入商品编码"></el-input>
      </el-form-item>
      <el-form-item label="供应商" class="formItem" placeholder="请选择">
        <AffiliatedSupplier v-model.trim="dataPage.facade.supplyId" :hasJdChance="true"></AffiliatedSupplier>
      </el-form-item>
      <!-- <el-form-item label="分支机构" class="formItem" placeholder="请选择">
        <OrgSelect v-model.trim="dataPage.facade.supplyId"></OrgSelect>
      </el-form-item>
      <el-form-item label="应用名称" class="formItem" placeholder="请选择">
        <ApplicationSelect v-model.trim="dataPage.facade.supplyId"></ApplicationSelect>
      </el-form-item>-->
      <el-form-item label="是否脱敏发货" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade.desensitizationStatus" :selectList="order_enum.C_isMaskList"></SelectModel>
      </el-form-item>
    </SearchForm>
    <OrderCustomTable
      class="order-container"
      :openERP="false"
      :openFold="false"
      :border="true"
      :dataPage="dataPage"
      :dataList="dataPage.dataList"
      :columns="columns"
    >
      <template #option>
        <AuthButton authKey="VO_AFTERWORD_EXPORT" type="primary" @click="exportHandler" :loading="dataPage.loadingExport">导出</AuthButton>
      </template>
      <template #customRow="{ row }">
        <div class="order_row">
          <div class="order_detail">
            <span>售后单编号:{{ row.afterSaleNo }}</span>
            <span>订单编号:{{ row.orderNo }}</span>
            <span>申请时间:{{ row.applyTime }}</span>
            <span>供应商:{{ row.supplyName }}</span>
          </div>
        </div>
      </template>
    </OrderCustomTable>
    <CustomPagination @pagingQuery="pagingQueryHarder" :page="dataPage.page"></CustomPagination>
  </PageContainer>
</template>

<style lang='scss' scoped>
.tabs-container {
  background-color: var(--el-bg-color);
  padding: 8px;

  ::v-deep(.el-tabs) {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}

.order-container {
  .order_row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .order_detail {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      gap: 100px;
      color: #999;
      .thirdOrderNo {
        width: 280px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>