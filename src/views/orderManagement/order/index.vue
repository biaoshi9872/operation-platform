<script setup lang='ts'>
defineOptions({ name: 'orderList' })
import order_api from '@/api/order/index'
import SkuDetail from '@/components/SkuDetail/index.vue'
import StateCell from '@/components/Tooltip/StateCell.vue'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import pageHooks from '@/hooks/pageListHooks'
import { tabsStore } from '@/stores'
import { IPage } from '@/types/from-types'
import goodPoor from '@/utils/constant/goodPoor'
import order_enum from '@/utils/constant/order'
import { ElButton } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { ref, resolveDirective, withDirectives } from 'vue'
import DeliverGood from '../components/DeliverGood/index.vue'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
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
  skuCode: '', //
  orgIdList: [], //应用进入应用的时候要传
  appIdList: [],
  submitTimeStart: '', //订单提交时间
  submitTimeEnd: '', //
  confirmTimeStart: '', //订单确认时间
  confirmTimeEnd: '', //
  orderNo: '', //开放平台订单号
  channelOrderNo: '', //渠道订单号
  supplyIds: [], //供应商
  skuName: '', //商品名称
  receiverName: '', //收货人
  channelSourceList: [], //
  orderStatusList: [],
  desensitizationStatus: '', //面单是否脱敏
}
const pageInfo = {
  page: 1,
  limit: 10,
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
  selectPage: order_api.A_page,
  defaultValueConversion: routeConversion,
  toDownloadCenterApi: order_api.A_orderExport,
  loadingCallback: dataRestCallback,
  dataList: [1],
  dataListCache: {
    '-999': [],
    '1': [],
    '2': [],
    '3': [],
    '-3': []
  },
  multipleList: [],
  curryInfo: null,
  page: {
    '-999': cloneDeep(pageInfo),
    '1': cloneDeep(pageInfo),
    '2': cloneDeep(pageInfo),
    '3': cloneDeep(pageInfo),
    '-3': cloneDeep(pageInfo)
  },
  isOnload: true,
  facade: {
    '-999': cloneDeep(searchForm),
    '1': cloneDeep(searchForm),
    '2': cloneDeep(searchForm),
    '3': cloneDeep(searchForm),
    '-3': cloneDeep(searchForm)
  },
  waitDeliverCount: 0,
  showDeliverGood: false,
  facadeKz: {
    tab: '-999'
  }
})

const waitingCount = () => {
  order_api.A_waitDeliverCount().then((res: any) => {
    dataPage.waitDeliverCount = res || 0
  })
}

onMounted(() => {
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
    value: '-999'
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
    label: '失败',
    value: '-3'
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
      channelOrderNo: row.channelOrderNo
    }
  })
}

//导出
const exportOrderHandler = (row: any) => {
  let obj = getQueryParams()
  toDownloadCenter({ ...obj })
}

const afterApplyHandler = (row: any, parentRow: any) => {
  tabsStoreInfo.reload({
    path: '/orderManagement/unLineAfterSaleOrder/index',
    query: {
      channelOrderNo: parentRow.channelOrderNo,
      skuCode: row.skuCode
    }
  })
}

const columns: any = ref([])

onMounted(() => {
  initColumns()
})

//批量发货
const batchDeliverHandler = (row: any) => {
  tabsStoreInfo.reload({
    path: '/ImportingTemplate/OrderBatchDelivery',
    query: {
      channelOrderNo: row.channelOrderNo
    }
  })
}
const devilryHandler = (row: any) => {
  dataPage.curryInfo = row
  dataPage.showDeliverGood = true
}

const initColumns = () => {
  columns.value = []
  columns.value.push({
    width: '120px',
    label: '是否脱敏发货',
    align: 'center',
    render: (row: any, column: any, index: any, parentRow: any) => {
      if (parentRow.channelSource == 104) {
        const title = parentRow?.desensitizationStatus === 1 ? '是' : '否'
        return h(StateCell, { title: title, isTrueState: parentRow?.desensitizationStatus == 1 })
      } else {
        return h('div', '-')
      }
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
      let spec = row.channelSource == 104 ? (row.attributeValue1 || '') + (row.attributeValue2 || '') : ''
      newRow.titleSpec = row.skuName + spec
      //商品详情
      const goodsDetail = h(SkuDetail, {
        goodDetail: newRow,
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
        ![0, 4, 5, -3].includes(parentRow.orderStatus) &&
        ![1, 4].includes(row.afterSaleStatus) &&
        [104, 105].includes(parentRow.channelSource) &&
        withDirectives(
          h(ElButton, {
            type: 'text',
            innerText: '申请售后',
            style: { 'margin-left': '65px' },
            onClick: () => {
              afterApplyHandler(row, parentRow)
            }
          }),
          [
            [
              authDir,
              {
                authKey: 'ORDER_SQSH',
                detail: row
              }
            ]
          ]
        )
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
      prop: 'platformPurchasePrice',
      align: 'center',
      width: '140px',
      render: (row: any) => {
        return h('div', `￥${row.platformPurchasePrice ?? ''}`)
      },
      openMarginCell: true
    })
  }
  columns.value.push({
    label: getSystemOptionType.value == 401 ? '含税供应价' : '平台供应价',
    prop: 'platformSupplyPrice',
    align: 'center',
    width: '140px',
    render: (row: any) => {
      return h('div', `￥${row.platformSupplyPrice ?? ''}`)
    },
    openMarginCell: true
  })
  if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '分销价',
      prop: 'retailPrice',
      align: 'center',
      width: '140px',
      render: (row: any) => {
        return h('div', `￥${row.retailPrice ?? ''}`)
      },
      openMarginCell: true
    })
  }
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
  if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '商品类型',
      align: 'center',
      width: '100px',
      prop: 'channelSource',
      render: (row: any) => {
        return h('div', goodPoor.getSourceTypeNameByKey(row.channelSource))
      }
    })
  }
  //顶级机构
  if (getSystemOptionType.value == '101') {
    columns.value.push({
      label: '机构名称',
      align: 'center',
      width: '160px',
      prop: 'orgName'
    })
    columns.value.push({
      label: '应用名称',
      align: 'center',
      width: '160px',
      prop: 'appName'
    })
  }
  //分支机构
  if (getSystemOptionType.value == '201') {
    columns.value.push({
      label: '应用名称',
      align: 'center',
      width: '160px',
      prop: 'appName'
    })
  }
  columns.value.push({
    label: '订单状态',
    'min-width': '120px',
    prop: 'orderStatus',
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
      const afterSaleStatus = order_enum.getAfter_order_statesTitle(row.afterSaleStatus)
      const statusDom = h('div', afterSaleStatus)
      return h('div', {}, [statusDom])
    },
    openMarginCell: true
  })
  columns.value.push(
    {
      label: '操作',
      align: 'center',
      render: (row: any, parentRow: any) => {
        //备注:自营体系才支持发货
        const viewButton =
          [105].includes(row.channelSource) &&
          [1, 2].includes(row.orderStatus) &&
          withDirectives(
            h(ElButton, {
              type: 'primary',
              innerText: row.orderStatus == 1 ? '发货' : '部分发货',
              onClick: () => {
                devilryHandler(row)
              }
            }),
            [[authDir, 'VO_PRODUCT_DEVIL']]
          )
        const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
        return h('div', { style }, [viewButton])
      }
    }
  )
}

//状态定制化
const orderStatusList = computed(() => {
  switch (String(dataPage.facadeKz.tab)) {
    case '-999':
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
          label: '失败',
          value: '-3'
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
  }
})
</script>

<template>
  <PageContainer v-loading="dataPage.loadingData">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page[dataPage.facadeKz.tab].page"
      class="el-search-item" @search="searchQueryHarder" :customReset="true" @reset="resetHandler">
      <template #tabs>
        <el-tabs v-model="dataPage.facadeKz.tab" @tab-change="tabChangHarder">
          <el-tab-pane v-for="item in orderTabs" :label="item.label" :name="item.value" :key="item.value">
            <template #label>
              <span class="badge">
                <el-badge :value="dataPage.waitDeliverCount" :hidden="item.value !== '1'">
                  <span class="pr-5">{{ item.label }}</span>
                </el-badge>
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
      <el-form-item label="提交订单时间" class="el-form-item-inputGroup">
        <DatePickerRange v-model:start="dataPage.facade[dataPage.facadeKz.tab].submitTimeStart"
          v-model:end="dataPage.facade[dataPage.facadeKz.tab].submitTimeEnd"></DatePickerRange>
      </el-form-item>
      <el-form-item label="确认下单时间" class="el-form-item-inputGroup">
        <DatePickerRange v-model:start="dataPage.facade[dataPage.facadeKz.tab].confirmTimeStart"
          v-model:end="dataPage.facade[dataPage.facadeKz.tab].confirmTimeEnd"></DatePickerRange>
      </el-form-item>
      <el-form-item v-if="(['10', '101', '20', '201'].includes(getSystemOptionType))" label="订单编号" class="formItem"
        placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].orderNo" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item v-show="['-999', '2', '4'].includes(dataPage.facadeKz.tab)" label="订单状态" class="formItem">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].orderStatusList" :multiple="true"
          :selectList="orderStatusList"></SelectModel>
      </el-form-item>
      <el-form-item label="商品名称" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].skuName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编码" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].skuCode" placeholder="请输入商品编码"></el-input>
      </el-form-item>
      <el-form-item label="收货人姓名" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].receiverName" placeholder="请输入收货人姓名"></el-input>
      </el-form-item>

      <el-form-item v-if="(['10', '101'].includes(getSystemOptionType))" label="供应商" class="formItem" placeholder="请选择">
        <AffiliatedSupplier v-model.trim="dataPage.facade[dataPage.facadeKz.tab].supplyIds" :hasJdChance="true">
        </AffiliatedSupplier>
      </el-form-item>
      <el-form-item v-if="['101'].includes(getSystemOptionType)" label="分支机构" class="formItem" placeholder="请选择">
        <OrgSelect v-model.trim="dataPage.facade[dataPage.facadeKz.tab].orgIdList" :multiple="true"></OrgSelect>
      </el-form-item>
      <el-form-item v-if="['101', '201'].includes(getSystemOptionType)" label="应用名称" class="formItem" placeholder="请选择">
        <ApplicationSelect v-model.trim="dataPage.facade[dataPage.facadeKz.tab].appIdList" valueKey="id"
          :multiple="true">
        </ApplicationSelect>
      </el-form-item>
      <el-form-item v-if="(['10', '101', '20', '201'].includes(getSystemOptionType))" label="商品类型" class="formItem"
        placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].channelSourceList"
          :selectList="goodPoor.sourceTypeList">
        </SelectModel>
      </el-form-item>
      <el-form-item label="是否脱敏发货" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].desensitizationStatus"
          :selectList="order_enum.C_isMaskList">
        </SelectModel>
      </el-form-item>
      <el-form-item :label="getSystemOptionType == 401 ? '订单编号' : '渠道订单编号'" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].channelOrderNo"
          :placeholder="getSystemOptionType == 401 ? '请输入订单编号' : '请输入渠道订单编号'"></el-input>
      </el-form-item>
    </SearchForm>
    <OrderCustomTable class="order-container" :openFold="false" :openERP="false" :border="true" :dataPage="dataPage"
      :dataList="dataList" orderChildAttr="goodsList" :columns="columns">
      <template #option>
        <AuthButton authKey="VO_ORDER_EXPORT" type="primary" @click="exportOrderHandler"
          :loading="dataPage.loadingExport">导出</AuthButton>
        <AuthButton authKey="VO_ORDER_BATCH_EXPORT" type="primary" @click="batchDeliverHandler">批量发货</AuthButton>
      </template>
      <template #customRow="{ row }">
        <div class="order_row">
          <div class="order_detail">
            <span v-if="(['10', '101', '20', '201'].includes(getSystemOptionType))" class="order-overflow"
              ref="orderNo">
              订单编号：
              <el-tooltip class="box-item" effect="dark" :content="row.orderNo" placement="top-start">{{ row.orderNo
                }}</el-tooltip>
            </span>
            <span class="order-overflow" ref="orderNo">
              {{ getSystemOptionType == 401 ? '订单编号:' : '渠道订单编号:' }}
              <el-tooltip class="box-item" effect="dark" :content="row.channelOrderNo" placement="top-start">{{
                row.channelOrderNo
                }}</el-tooltip>
            </span>
            <span>提交订单时间:{{ row.submitTime }}</span>
            <span>确认下单时间:{{ row.confirmTime }}</span>
            <span v-if="getSystemOptionType == 101">供应商:{{ row.supplyName }}</span>
            <span v-else-if="getSystemOptionType == 201 && row.channelSource == 105">供应商:{{ row.supplyName }}</span>
            <span>订单总金额:￥{{ row.totalAmount }}</span>
          </div>
          <div>
            <el-button type="primary" @click="toOrderDetailHandler(row)" link>查看详情</el-button>
          </div>
        </div>
      </template>
    </OrderCustomTable>
    <CustomPagination @pagingQuery="pagingQueryHarder" :page="dataPage.page[dataPage.facadeKz.tab]"></CustomPagination>
    <DeliverGood v-model="dataPage.showDeliverGood" :outgoingType="1" :curryInfo="dataPage.curryInfo"
      @refresh="searchQueryHarder">
    </DeliverGood>
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