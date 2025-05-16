<script setup lang='ts'>
defineOptions({ name: 'orderList' })
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import SkuDetail from '@/components/SkuDetail/index.vue'
import order_enum from '@/utils/constant/order'
// import { A_getOrderPageList, A_orderExport, A_waitingCount } from '@/api/orderManger'
import { ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import { ref, resolveDirective, withDirectives } from 'vue'
// import { ORDERSTATUS, DELIVERSTAUS, AFTERSALESTATUS, getDictNameByKey } from '@/utils/constant'
// import authorization from '@/utils/constant/authorization'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import { tabsStore } from '@/stores'
import { cloneDeep } from 'lodash-es'
import StateCell from '@/components/Tooltip/StateCell.vue'
import goodPoor from '@/utils/constant/goodPoor'
// import ycb_bulkOrder_enum from '@/utils/constant/bulkOrder'
const { isFromOrgLast } = isStateCheckHooks()
const tabsStoreInfo: any = tabsStore()
const authDir = resolveDirective('auth')
const $route = useRoute()
const routeConversion = () => {
  const { query } = $route
  if (query) {
    dataPage.facadeKz.tab = query.tab ? String(query.tab) : dataPage.facadeKz.tab
  }
}
const searchForm = {
  orderNo: '', //订单号
  parentOrderNo: '', //父订单号
  goodsName: '',
  thirdOrderNo: '', //第三方订单号
  skuCod: '',
  orderTimeStart: '',
  orderTimeEnd: '',
  confirmTimeStart: '',
  confirmTimeEnd: '',
  cancelTimeStart: '',
  cancelTimeEnd: '',
  finishTimeStart: '',
  finishTimeEnd: '',
  orderStatus: [],
  receiverName: '',
  receiverPhone: '',
  buyer: '',
  supplyId: [],
  merchantNo: [],
  channelCodeListModel: null,
  desensitizationStatus: null,
  erpType: null
}
const pageInfo = {
  page: 1,
  limit: 10,
  toreceiveCount: 0,
  totalCount: 0
}
const dataRestCallback = (res: any) => {
  //@ts-ignore
  dataPage.dataListCache[dataPage.facadeKz.tab] = (res?.list || res?.page?.records || res?.page?.list || res || []) as any
  dataPage.page[dataPage.facadeKz.tab].totalCount = res?.page?.totalCount || res?.totalRow || res?.page?.totalRow || 0
}
const dataList = computed(() => {
  //@ts-ignore
  return dataPage.dataListCache[dataPage.facadeKz.tab]
})

//@ts-ignore
const dataPage: IPage<API.OrderListParams, API.OrderListRowInfo> = reactive({
  selectPage: null, //A_getOrderPageList,
  defaultValueConversion: routeConversion,
  toDownloadCenterApi: null, //A_orderExport,
  loadingCallback: dataRestCallback,
  dataList: [1],
  dataListCache: {
    '-1': [],
    '1': [],
    '2': [],
    '3': [],
    '4': []
  },
  multipleList: [],
  curryInfo: null,
  page: {
    '-1': cloneDeep(pageInfo),
    '1': cloneDeep(pageInfo),
    '2': cloneDeep(pageInfo),
    '3': cloneDeep(pageInfo),
    '4': cloneDeep(pageInfo)
  },
  isOnload: false,
  facade: {
    '-1': cloneDeep(searchForm),
    '1': cloneDeep(searchForm),
    '2': cloneDeep(searchForm),
    '3': cloneDeep(searchForm),
    '4': cloneDeep(searchForm)
  },
  facadeKz: {
    tab: '-1'
  }
})

const waitingCount = () => {
  // A_waitingCount({}).then((res: any) => {
  //   dataPage.page.toreceiveCount = res || 0
  // })
}

onMounted(() => {
  console.log('onMounted')
  waitingCount()
})

const { pagingQuery, searchQuery, toDownloadCenter, handleReset } = pageHooks(dataPage)

//重置
const resetHandler = () => {
  dataPage.facade[dataPage.facadeKz.tab] = cloneDeep(searchForm)
  ////
}
// 查询回调
const getQueryParams = () => {
  const { page, facade, facadeKz } = dataPage
  const searchFaded = facade[facadeKz.tab]
  const searchPage = page[facadeKz.tab]
  return { ...searchPage, ...searchFaded, ...facadeKz }
}

// 查询回调
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj, dataRestCallback)
  waitingCount()
}

// 分页回调
const pagingQueryHarder = () => {
  const obj = getQueryParams()
  pagingQuery(obj, dataRestCallback)
}

const orderTabs = ref([
  {
    label: '全部订单',
    value: '-1'
  },
  {
    label: '待发货',
    value: '1'
  },
  {
    label: '已发货',
    value: '2'
  },
  {
    label: '已完成',
    value: '3'
  },
  {
    label: '取消',
    value: '4'
  }
])
const tabChangHarder = () => {
  //handleReset()
  searchQueryHarder()
}

const toOrderDetailHandler = (row: any) => {
  tabsStoreInfo.reload({
    path: '/orderManagement/order/orderDetail',
    query: {
      orderNo: row.orderNo
    }
  })
}

//导出
const exportOrderHandler = (row: any) => {
  let obj = getQueryParams()
  toDownloadCenter({ ...obj })
}

const afterApplyHandler = (row: any) => {
  tabsStoreInfo.reload({
    path: '/orderManagement/unLineAfterSaleOrder/index',
    query: {
      subOrderNo: row.subOrderNo
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
    label: '商品信息',
    prop: '1',
    minWidth: '300px',
    align: 'left',
    render: (row: any, column: any, index: any, parentRow: any) => {
      console.log(row, 'row,row')
      let newRow = row
      newRow.titleSpec = row.title + ' ' + (row.spec || '')
      //商品详情
      const goodsDetail = h(SkuDetail, {
        goodDetail: newRow,
        showExtraCode: true,
        width: '100%',
        dataList: parentRow.detailList,
        customAttribute: {
          url: 'images',
          name: 'titleSpec',
          id: 'skuCode'
        }
      })
      //申请售后
      const afterButton =
        ![0, 4, 5, -1].includes(parentRow.orderStatus) &&
        !['已完成', '售后中'].includes(row.currentFlowNodeCode) &&
        h(ElButton, {
          type: 'text',
          innerText: '申请售后',
          style: { 'margin-left': '95px' },
          onClick: () => {
            afterApplyHandler(row)
          }
        })
      return h('div', {}, [goodsDetail, afterButton])
    },
    openMarginCell: true
  })
  columns.value.push({
    'min-width': '120px',
    label: '数量',
    align: 'center',
    marginAttr: 'goodsNum'
  })
  if (!isFromOrgLast.value) {
    columns.value.push({
      label: '平台成本',
      prop: 'taxPurchaseCost',
      align: 'center',
      width: '140px',
      render: (row: any) => {
        return h('div', `￥${row.taxPurchaseCost ?? ''}`)
      },
      openMarginCell: true
    })
  }
  columns.value.push({
    label: '平台供应价',
    prop: 'taxPurchaseCost',
    align: 'center',
    width: '140px',
    render: (row: any) => {
      return h('div', `￥${row.taxPurchaseCost ?? ''}`)
    },
    openMarginCell: true
  })
  columns.value.push({
    label: '分销价',
    prop: 'taxPurchaseCost',
    align: 'center',
    width: '140px',
    render: (row: any) => {
      return h('div', `￥${row.taxPurchaseCost ?? ''}`)
    },
    openMarginCell: true
  })
  columns.value.push({
    label: '销售单位',
    align: 'center',
    'min-width': '120px',
    marginAttr: 'unit'
  })
  columns.value.push({
    label: '收货人',
    align: 'center',
    'min-width': '120px',
    prop: 'receiverName'
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
    label: '订单状态',
    'min-width': '120px',
    render: (row: any) => {
      let statusDom = h('div', order_enum.getDictNameByKey(order_enum.order_states, row.orderStatus)) //订单状态
      //状态显示
      return h('div', {}, [statusDom])
    }
  })
  columns.value.push({
    label: '售后状态',
    prop: 'afterStatus',
    'min-width': '120px',
    render: (row: any) => {
      //状态显示
      const statusDom = h('div', row.currentFlowNodeCode)
      return h('div', {}, [statusDom])
    },
    openMarginCell: true
  })
}

//状态定制化
const orderStatusList = computed(() => {
  switch (String(dataPage.facadeKz.tab)) {
    case '-1':
      return [
        {
          value: '1',
          label: '待发货'
        },
        {
          value: '2',
          label: '部分发货'
        },
        {
          value: '3',
          label: '已发货'
        },
        {
          value: '6',
          label: '已完成'
        },
        {
          value: '4',
          label: '已取消'
        },
        {
          value: '5',
          label: '取消中'
        }
      ]
    case '2':
      return [
        {
          value: '2',
          label: '部分发货'
        },
        {
          value: '3',
          label: '已发货'
        }
      ]
    case '4':
      return [
        {
          value: '4',
          label: '已取消'
        },
        {
          value: '5',
          label: '取消中'
        }
      ]
  }
})
</script>

<template>
  <PageContainer v-loading="dataPage.loadingData">
    <SearchForm
      v-model:model="dataPage.facade"
      v-model:current-page="dataPage.page[dataPage.facadeKz.tab].page"
      class="el-search-item"
      @search="searchQueryHarder"
      :customReset="true"
      @reset="resetHandler"
    >
      <template #tabs>
        <el-tabs v-model="dataPage.facadeKz.tab" @tab-change="tabChangHarder">
          <el-tab-pane v-for="item in orderTabs" :label="item.label" :name="item.value" :key="item.value">
            <template #label>
              <span class="badge">
                <el-badge :value="dataPage.page.toreceiveCount" :hidden="item.value !== '1'">
                  <span class="pr-5">{{ item.label }}</span>
                </el-badge>
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
      <el-form-item label="提交订单时间" class="el-form-item-inputGroup">
        <DatePickerRange
          v-model:start="dataPage.facade[dataPage.facadeKz.tab].orderTimeStart"
          v-model:end="dataPage.facade[dataPage.facadeKz.tab].orderTimeEnd"
        ></DatePickerRange>
      </el-form-item>
      <el-form-item label="确认下单时间" class="el-form-item-inputGroup">
        <DatePickerRange
          v-model:start="dataPage.facade[dataPage.facadeKz.tab].confirmTimeStart"
          v-model:end="dataPage.facade[dataPage.facadeKz.tab].confirmTimeEnd"
        ></DatePickerRange>
      </el-form-item>
      <el-form-item label="订单编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].orderNo" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item v-show="['-1', '2', '4'].includes(dataPage.facadeKz.tab)" label="订单状态" class="formItem">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].orderStatus" :multiple="true" :selectList="orderStatusList"></SelectModel>
      </el-form-item>
      <!-- <el-form-item label="供应商" class="formItem" placeholder="请选择">
        <AffiliatedSupplier v-model.trim="dataPage.facade[dataPage.facadeKz.tab].supplyId" :hasJdChance="true"></AffiliatedSupplier>
      </el-form-item>-->
      <el-form-item label="商品名称" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].goodsName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编码" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].skuCode" placeholder="请输入商品编码"></el-input>
      </el-form-item>
      <el-form-item label="收货人姓名" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].receiverName" placeholder="请输入收货人姓名"></el-input>
      </el-form-item>
      <!-- <el-form-item v-show="['-1', '3'].includes(dataPage.facadeKz.tab)" label="订单完成时间" class="el-form-item-inputGroup">
        <DatePickerRange v-model:start="dataPage.facade[dataPage.facadeKz.tab].finishTimeStart" v-model:end="dataPage.facade.finishTimeEnd"></DatePickerRange>
      </el-form-item>-->
      <el-form-item v-show="['4'].includes(dataPage.facadeKz.tab)" label="订单取消时间" class="el-form-item-inputGroup">
        <DatePickerRange
          v-model:start="dataPage.facade[dataPage.facadeKz.tab].cancelTimeStart"
          v-model:end="dataPage.facade[dataPage.facadeKz.tab].cancelTimeEnd"
        ></DatePickerRange>
      </el-form-item>
      <!-- <el-form-item label="父订单编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].parentOrderNo" placeholder="请输入父订单编号"></el-input>
      </el-form-item>-->

      <!-- <el-form-item label="收货人手机号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].receiverPhone" placeholder="请输入收货人手机号"></el-input>
      </el-form-item>
      <el-form-item label="下单人" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].buyer" placeholder="请输入下单人"></el-input>
      </el-form-item>-->
      <el-form-item label="商品类型" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade.desensitizationStatus" :selectList="goodPoor.sourceTypeList"></SelectModel>
      </el-form-item>
      <el-form-item label="是否脱敏发货" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade.desensitizationStatus" :selectList="order_enum.C_isMaskList"></SelectModel>
      </el-form-item>
      <el-form-item label="渠道订单编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].thirdOrderNo" placeholder="请输入渠道订单编号"></el-input>
      </el-form-item>
    </SearchForm>
    <OrderCustomTable
      class="order-container"
      :openFold="false"
      :openERP="false"
      :border="true"
      :dataPage="dataPage"
      :dataList="dataList"
      orderChildAttr="detailList"
      :columns="columns"
    >
      <template #option>
        <AuthButton authKey="VO_ORDER_EXPORT" type="primary" @click="exportOrderHandler" :loading="dataPage.loadingExport">导出</AuthButton>
      </template>
      <template #customRow="{ row }">
        <div class="order_row">
          <div class="order_detail">
            <span class="order-overflow" ref="orderNo">
              订单编号：
              <el-tooltip class="box-item" effect="dark" :content="row.orderNo " placement="top-start">{{ row.orderNo }}</el-tooltip>
            </span>
            <span class="order-overflow" ref="orderNo">
              渠道订单编号：
              <el-tooltip class="box-item" effect="dark" :content="row.orderNo " placement="top-start">{{ row.orderNo }}</el-tooltip>
            </span>
            <span>提交订单时间:{{ row.createDate }}</span>
            <span>确认下单时间:{{ row.confirmTime }}</span>
            <span>供应商:{{ row.totalAmount }}</span>
            <span>订单总金额:￥{{ row.totalAmount }}</span>
          </div>
          <div>
            <el-button type="primary" @click="toOrderDetailHandler(row)" link>查看详情</el-button>
          </div>
        </div>
      </template>
    </OrderCustomTable>
    <CustomPagination @pagingQuery="pagingQueryHarder" :page="dataPage.page[dataPage.facadeKz.tab]"></CustomPagination>
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
      gap: 40px;
      color: #999;
      .thirdOrderNo {
        width: 280px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    @media screen and (min-width: 100px) and (max-width: 1750px) {
      .order-overflow {
        // display: block;
        overflow: hidden;
        white-space: nowrap;
        max-width: 200px;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>