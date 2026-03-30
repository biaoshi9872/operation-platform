<script setup lang="ts">
defineOptions({ name: 'orderList' })
import order_api from '@/api/order/index'
import SkuDetail from '@/components/SkuDetail/index.vue'
import eventBus from '@/utils/eventBus'
import pageHooks from '@/hooks/pageListHooks'
import { tabsStore, useRouterStore, useUserStore } from '@/stores'
import { IPage } from '@/types/from-types'
import goodPoor from '@/utils/constant/goodPoor'
import order_enum from '@/utils/constant/order'
import { ElButton } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { ref, resolveDirective, withDirectives } from 'vue'
import DeliverGood from '../components/DeliverGood/index.vue'
import system_enum from '@/utils/constant/system'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import StateCell from '@/components/Tooltip/StateCell.vue'

const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
const tabsStoreInfo: any = tabsStore()
const $routerStore: any = useRouterStore()
const $userStore = useUserStore()
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
  delayTimeStart: '', //延迟开始时间
  delayTimeEnd: '', //延迟结束时间
  orderNo: '', //开放平台订单号
  channelOrderNo: '', //渠道订单号
  thirdOrderNo: '', //第三方订单号
  supplyIds: [], //供应商
  skuName: '', //商品名称
  receiverName: '', //收货人
  channelSourceList: [], //
  orderStatusList: [],
  desensitizationStatus: '', //面单是否脱敏
  outTradeNo: '', //电商订单编号(子单)
  branchName: '', //分行名称
  exchangeStatusList: null,
  thirdCouponId: '', //第三方券ID
  couponPlatform: ''
}
const pageInfo = {
  page: 1,
  limit: 10,
  totalCount: 0
}
const isShowBackName = computed(() => {
  let SYS_HIDE_BANK = $routerStore?.config?.SYS_HIDE_BANK || ''
  let curryOrgId = $userStore?.userInfo?.orgId || ''
  let arrId = SYS_HIDE_BANK?.split(',')?.map(Number) || []
  return arrId.includes(curryOrgId)
})
const dataRestCallback = (res: any) => {
  //@ts-ignore
  initColumns()
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
    '4': [],
    '-3': []
  },
  multipleList: [],
  curryInfo: null,
  page: {
    '-999': cloneDeep(pageInfo),
    '1': cloneDeep(pageInfo),
    '2': cloneDeep(pageInfo),
    '3': cloneDeep(pageInfo),
    '4': cloneDeep(pageInfo),
    '-3': cloneDeep(pageInfo)
  },
  isOnload: true,
  facade: {
    '-999': cloneDeep(searchForm),
    '1': cloneDeep(searchForm),
    '2': cloneDeep(searchForm),
    '3': cloneDeep(searchForm),
    '4': cloneDeep(searchForm),
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
  },
  {
    label: '延迟中',
    value: '4'
  }
])

const orderTabsList = computed(() => {
  return orderTabs.value.filter((item: any) => {
    if (item.value == '4') {
      return !['401', '201', '20'].includes(getSystemOptionType.value)
    }
    return true
  })
})
const tabChangHarder = () => {
  //handleReset()
  searchQueryHarder()
}

const toOrderDetailHandler = (row: any) => {
  tabsStoreInfo.reload({
    path: '/orderManagement/order/orderDetail',
    query: {
      channelOrderNo: row.channelOrderNo,
      source: row.channelSource
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
      skuCode: row.skuCode,
      type: parentRow.channelSource == 63 ? 1 : 0
    }
  })
}
//申请赔付
const applyCompensationHandler = (row: any, parentRow: any) => {
  tabsStoreInfo.reload({
    path: '/orderManagement/compensationOrder/applyCompensation',
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

// watch(() => dataPage.facade[dataPage.facadeKz.tab]?.channelSourceList, (newVal: any) => {
//   if (newVal) {
//     initColumns()
//   }
// }, {
//   deep: true
// })

const isHideUserInfo = computed(() => {
  const allowSet = new Set(['106', '107', '108'])
  const current = dataPage.facade[dataPage.facadeKz.tab]?.channelSourceList
  if (!current) return false
  if (Array.isArray(current)) {
    if (current.length === 0) return false
    return current.every((v: any) => allowSet.has(String(v)))
  }
  return allowSet.has(String(current))
})

const initColumns = () => {
  columns.value = []
  columns.value.push({
    width: '120px',
    label: '是否脱敏发货',
    align: 'center',
    render: (row: any, parentRow: any) => {
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
    width: '260px',
    align: 'left',
    render: (row: any, parentRow: any) => {
      console.log(row, 'row,row')
      let newRow = row
      let spec = row.channelSource == 104 ? (row.attributeValue1 || '') + (row.attributeValue2 || '') : ''
      newRow.titleSpec = row.skuName + spec
      let orderGifArr: any = []
      //赠品逻辑
      row.orderGiftList?.forEach((item: any) => {
        let itemNew = h(SkuDetail, {
          goodDetail: {
            ...item,
            isGift: true
          },
          productSource: parentRow.channelSource,
          appId: parentRow.appId,
          showDetailButton: true,
          style: { height: '83px' },
          showGiveawayTagBox: true,
          customAttribute: {
            url: 'imageUrl',
            name: 'skuName',
            id: 'skuCode'
          }
        })
        orderGifArr.push(itemNew)
      })
      //商品详情
      const goodsDetail = h('div', {}, [
        h(SkuDetail, {
          goodDetail: newRow,
          productSource: parentRow.channelSource,
          appId: parentRow.appId,
          showDetailButton: true,
          style: { height: '83px' },
          dataList: parentRow.detailList,
          showGiveawayTagBox: true,
          customAttribute: {
            url: 'images',
            name: 'titleSpec',
            id: 'skuCode'
          }
        }),
        ...orderGifArr
      ])



      //申请售后
      const afterButton =
        ![0, 4, 5, -3].includes(parentRow.orderStatus) &&
        ![1, 4].includes(row.afterSaleStatus) &&
        [104, 105, 63].includes(parentRow.channelSource) &&
        withDirectives(
          h(ElButton, {
            type: 'text',
            innerText: '申请售后',
            style: { 'margin-left': '78px' },
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
      const applyCompensationButton =
        ![0].includes(row.tmCompensationStatus) &&
        [63].includes(parentRow.channelSource) &&
        withDirectives(
          h(ElButton, {
            type: 'text',
            innerText: '申请赔付',
            style: { 'margin-left': '12px' },
            onClick: () => {
              applyCompensationHandler(row, parentRow)
            }
          }),
          [
            [
              authDir,
              {
                authKey: 'ORDER_SHLP',
                detail: row
              }
            ]
          ]
        )
      return h('div', {}, [goodsDetail, afterButton, applyCompensationButton])
    },
    openMarginCell: true
  })
  columns.value.push({
    'min-width': '120px',
    label: '数量',
    align: 'center',
    marginAttr: 'goodsNum',
    openMarginCell: true,
    render: (row: any, parentRow: any) => {
      //赠品逻辑
      let orderGifArr: any = []
      let style = { height: '80px', display: 'flex', 'align-items': 'center', 'justify-content': 'center' }
      row.orderGiftList?.forEach((item: any) => {
        let itemNew = h('div', { style: style }, item.totalNum)
        orderGifArr.push(itemNew)
      })
      return h('div', [h('div', { style: style }, row.goodsNum), ...orderGifArr])
    }
  })
  if (!isFromOrgLast.value) {
    columns.value.push({
      label: '平台成本',
      prop: 'platformPurchasePrice',
      align: 'center',
      'min-width': '120px',
      render: (row: any) => {
        return h('div', row.isGift ? '-' : `￥${row.platformPurchasePrice ?? ''}`)
      },
      openMarginCell: true
    })
  }
  columns.value.push({
    label: getSystemOptionType.value == 401 ? '含税供应价' : '平台供应价',
    prop: 'platformSupplyPrice',
    align: 'center',
    'min-width': '120px',
    render: (row: any) => {
      return h('div', row.isGift ? '-' : `￥${row.platformSupplyPrice ?? ''}`)
    },
    openMarginCell: true
  })
  if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '分销价',
      prop: 'retailPrice',
      align: 'center',
      'min-width': '120px',
      render: (row: any) => {
        return h('div', row.isGift ? '-' : `￥${row.retailPrice ?? ''}`)
      },
      openMarginCell: true
    })
  }
  if (!isHideUserInfo.value) {
    columns.value.push({
      label: '销售单位',
      align: 'center',
      'min-width': '120px',
      prop: 'unit',
      openMarginCell: true,
      marginAttr: 'unit'
    })
    columns.value.push({
      label: '收货人',
      align: 'center',
      'min-width': '120px',
      prop: 'receiverName'
    })
  }
  if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '商品类型',
      align: 'center',
      'min-width': '120px',
      prop: 'channelSource',
      render: (row: any, parentRow: any) => {
        return h('div', goodPoor.getSourceTypeNameByKey(parentRow.channelSource))
      }
    })
  }
  columns.value.push({
    label: '订单状态',
    'min-width': '120px',
    prop: 'orderStatus',
    render: (row: any, parentRow: any) => {
      let statusDom = h('div', order_enum.getDictNameByKey(order_enum.order_states, parentRow.orderStatus)) //订单状态
      //状态显示
      return h('div', { style: { display: 'flex', 'align-items': 'center', 'justify-content': 'center' } }, [statusDom])
    }
  })

  if (['10', '101'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '批次号',
      'width': '100px',
      showOverflowTooltip: true,
      align: 'center',
      prop: 'thirdBatchNo',
    })
  }

  if (['10', '101'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '领取账号',
      'width': '100px',
      align: 'center',
      showOverflowTooltip: true,
      prop: 'accountNumber',
    })
  }

  if (['10', '101'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '券ID',
      'width': '100px',
      align: 'center',
      showOverflowTooltip: true,
      prop: 'thirdCouponId',
    })
  }

  if (['10', '101'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '兑换状态',
      'min-width': '120px',
      prop: 'exchangeStatus',
      render: (row: any, parentRow: any) => {
        let statusDom = h('div', system_enum.getExchangeStatusList(parentRow.exchangeStatus)) //订单状态
        //状态显示
        return h('div', { style: { display: 'flex', 'align-items': 'center', 'justify-content': 'center' } }, [statusDom])
      }
    })
  }
  if (!isHideUserInfo.value) {
    columns.value.push({
      label: '售后状态',
      prop: 'afterStatus',
      align: 'center',
      'min-width': '120px',
      render: (row: any, parentRow: any) => {
        //状态显示
        const afterSaleStatus = order_enum.getAfter_order_statesTitle(row.afterSaleStatus)
        const statusDom = h('div', {}, afterSaleStatus)
        return h('div', { style: { display: 'flex', 'align-items': 'center', 'justify-content': 'center' } }, [statusDom])
      },
      openMarginCell: true
    })
  }
  if (['10', '101'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '项目类型',
      align: 'center',
      'min-width': '120px',
      prop: 'projectType',
      render: (row: any, parentRow: any) => {
        let projectTypeName = h('div', system_enum.getProjectType(parentRow.projectType)) //订单状态
        //状态显示
        return h('div', {}, [projectTypeName])
      }
    })
  }
  columns.value.push({
    label: '操作',
    align: 'center',
    fixed: 'right',
    minWidth: '140px',
    render: (row: any, parentRow: any) => {
      const detailButton = h(ElButton, {
        type: 'primary',
        link: true,
        innerText: '查看详情',
        onClick: () => {
          toOrderDetailHandler(parentRow) //
        }
      })
      //备注:自营体系才支持发货
      const viewButton =
        [105].includes(parentRow.channelSource) &&
        [1, 2].includes(parentRow.orderStatus) &&
        withDirectives(
          h(ElButton, {
            type: 'primary',
            innerText: parentRow.orderStatus == 1 ? '发货' : '部分发货',
            onClick: () => {
              devilryHandler(parentRow)
            }
          }),
          [[authDir, 'VO_PRODUCT_DEVIL']]
        )
      const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
      return h('div', { style }, [detailButton, viewButton])
    }
  })
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
eventBus.on('orderRefresh', searchQueryHarder)
</script>

<template>
  <PageContainer v-loading="dataPage.loadingData">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page[dataPage.facadeKz.tab].page"
      class="el-search-item" @search="searchQueryHarder" :customReset="true" @reset="resetHandler">
      <template #tabs>
        <el-tabs v-model="dataPage.facadeKz.tab" @tab-change="tabChangHarder">
          <el-tab-pane v-for="item in orderTabsList" :label="item.label" :name="item.value" :key="item.value">
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
      <el-form-item label="延迟时间" class="el-form-item-inputGroup" v-if="['4'].includes(dataPage.facadeKz.tab)">
        <DoubleInput v-model:start="dataPage.facade[dataPage.facadeKz.tab].delayTimeStart"
          v-model:end="dataPage.facade[dataPage.facadeKz.tab].delayTimeEnd"></DoubleInput>
      </el-form-item>
      <el-form-item v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" label="订单编号" class="formItem"
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
      <el-form-item label="收货人手机号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].receiverPhone"
          placeholder="请输入收货人手机号"></el-input>
      </el-form-item>
      <el-form-item v-if="['10', '101'].includes(getSystemOptionType)" label="供应商" class="formItem" placeholder="请选择">
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
      <el-form-item v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" label="商品类型" class="formItem"
        placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].channelSourceList"
          :selectList="goodPoor.sourceTypeList"> </SelectModel>
      </el-form-item>
      <el-form-item label="是否脱敏发货" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].desensitizationStatus"
          :selectList="order_enum.C_isMaskList"> </SelectModel>
      </el-form-item>
      <el-form-item :label="getSystemOptionType == 401 ? '订单编号' : '供应商订单编号'" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].channelOrderNo"
          :placeholder="getSystemOptionType == 401 ? '请输入订单编号' : '请输入供应商订单编号'"></el-input>
      </el-form-item>
      <el-form-item label="第三方订单编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].thirdOrderNo"
          placeholder="请输入第三方订单编号"></el-input>
      </el-form-item>
      <el-form-item label="电商订单编号(子单)" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].outTradeNo"
          placeholder="请输入电商订单编号(子单)"></el-input>
      </el-form-item>
      <el-form-item label="分行名称" class="formItem" v-if="isShowBackName">
        <BranchSelect v-model:modelName="dataPage.facade[dataPage.facadeKz.tab].branchName"
          v-model="dataPage.facade[dataPage.facadeKz.tab].branchId" placeholder="请选择分行名称">
        </BranchSelect>
      </el-form-item>
      <el-form-item v-if="['101'].includes(getSystemOptionType)" label="项目类型" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].projectTypeList"
          :selectList="system_enum.projectType"> </SelectModel>
      </el-form-item>
      <el-form-item v-if="['10', '101'].includes(getSystemOptionType)" label="兑换状态" class="formItem">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].exchangeStatusList"
          :selectList="system_enum.exchangeStatusList"> </SelectModel>
      </el-form-item>
      <el-form-item v-if="['10', '101'].includes(getSystemOptionType)" label="批次号" class="formItem">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].thirdBatchNo" placeholder="请输入批次号"></el-input>
      </el-form-item>
      <el-form-item v-if="['10', '101'].includes(getSystemOptionType)" label="券ID" class="formItem">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].thirdCouponId" placeholder="请输入券ID"></el-input>
      </el-form-item>
      <el-form-item v-if="['10', '101'].includes(getSystemOptionType)" label="领取账号" class="formItem">
        <el-input v-model.trim="dataPage.facade[dataPage.facadeKz.tab].accountNumber" placeholder="请输入领取账号"></el-input>
      </el-form-item>
      <el-form-item v-if="['10', '101'].includes(getSystemOptionType)" label="立减金平台" class="formItem">
        <SelectModel v-model.trim="dataPage.facade[dataPage.facadeKz.tab].couponPlatform"
          :selectList="system_enum.couponPlatformList"> </SelectModel>
      </el-form-item>
    </SearchForm>
    <OrderTable class="order-container" :openFold="false" :openERP="true" :border="true" :dataPage="dataPage"
      :dataList="dataList" orderChildAttr="goodsList" :columns="columns">
      <template #option>
        <AuthButton authKey="VO_ORDER_EXPORT" type="primary" @click="exportOrderHandler"
          :loading="dataPage.loadingExport">导出</AuthButton>
        <AuthButton authKey="VO_ORDER_BATCH_EXPORT" type="primary" @click="batchDeliverHandler">批量发货</AuthButton>
      </template>
      <template #customRow="{ row }">
        <div class="order_row">
          <div class="order_detail">
            <div class="detail_line detail_line--top">
              <div class="detail_top_main">
                <span v-if="['10', '101', '20', '201'].includes(getSystemOptionType)"
                  class="detail_item detail_item--headline">
                  <span class="title">订单编号:</span>
                  <span class="value">{{ row.orderNo || '-' }}</span>
                  <el-divider direction="vertical" />
                </span>
                <span class="detail_item detail_item--headline">
                  <span class="title">{{ getSystemOptionType == 401 ? '订单编号:' : '供应商订单编号:' }}</span>
                  <span class="value">{{ row.channelOrderNo || '-' }}</span>
                  <el-divider direction="vertical" />
                </span>
                <span class="detail_item detail_item--minor">
                  <span class="title">第三方订单编号:</span>
                  <span class="value">{{ row.thirdOrderNo || '-' }}</span>
                  <el-divider direction="vertical" />
                </span>
                <span class="detail_item detail_item--minor">
                  <span class="title">电商订单编号(子单):</span>
                  <span class="value">{{ row.outTradeNo || '-' }}</span>
                  <el-divider direction="vertical" />
                </span>
              </div>
              <div class="detail_top_amount">
                <span class="amount_item">
                  <span class="title">订单总金额:</span>
                  <span class="value">￥{{ row.totalAmount }}</span>
                  <el-divider direction="vertical" />
                </span>
                <span v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" class="amount_item">
                  <span class="title">订单结算总金额:</span>
                  <span class="value">￥{{ row.settlementPrice }}</span>
                </span>
              </div>
            </div>
            <div class="detail_line detail_line--bottom">
              <span class="detail_item">
                <span class="title">提交订单时间:</span>
                <span class="value">{{ row.submitTime || '-' }}</span>
                <el-divider direction="vertical" />
              </span>
              <span class="detail_item">
                <span class="title">确认下单时间:</span>
                <span class="value">{{ row.confirmTime || '-' }}</span>
                <el-divider direction="vertical" />
              </span>
              <span v-if="['4'].includes(dataPage.facadeKz.tab)" class="detail_item">
                <span class="title">延迟时间:</span>
                <span class="value">{{ row.delayTime ?? '-' }}分钟</span>
                <el-divider direction="vertical" />
              </span>
              <span v-if="getSystemOptionType == 101" class="detail_item">
                <span class="title">机构名称:</span>
                <span class="value">{{ row.orgName ?? '-' }}</span>
                <el-divider direction="vertical" />
              </span>
              <span v-if="['101', '201'].includes(getSystemOptionType)" class="detail_item">
                <span class="title">应用名称:</span>
                <span class="value">{{ row.appName ?? '-' }}</span>
                <el-divider direction="vertical" />
              </span>
              <span v-if="isShowBackName" class="detail_item">
                <span class="title">分行名称:</span>
                <span class="value">{{ row.branchName ?? '-' }}</span>
                <el-divider direction="vertical" />
              </span>
              <span v-if="getSystemOptionType == 101" class="detail_item">
                <span class="title">供应商名称:</span>
                <span class="value">{{ row.supplyName ?? '-' }}</span>
              </span>
              <span v-else-if="getSystemOptionType == 201 && row.channelSource == 105" class="detail_item">
                <span class="title">供应商名称:</span>
                <span class="value">{{ row.supplyName ?? '-' }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </OrderTable>
    <CustomPagination @pagingQuery="pagingQueryHarder" :page="dataPage.page[dataPage.facadeKz.tab]"></CustomPagination>
    <DeliverGood v-model="dataPage.showDeliverGood" :outgoingType="1" :curryInfo="dataPage.curryInfo"
      @refresh="searchQueryHarder"> </DeliverGood>
  </PageContainer>
</template>

<style lang="scss" scoped>
.tabs-container {
  background-color: var(--el-bg-color);
  padding: 8px;

  ::v-deep(.el-tabs) {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}

::v-deep(.order-row-content) {
  padding: 0 !important;
}

.order_row {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;

  .order_detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 16px 8px;
    background: #f7fbff;

    .detail_line {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
    }

    .detail_line--top {
      display: flex;
      gap: 24px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(223, 230, 239, 0.9);
    }

    .detail_top_main {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      min-width: 0;
    }

    .detail_top_amount {
      display: inline-flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-end;
      flex: 0 0 auto;
      margin-left: auto;
      white-space: nowrap;
    }

    .detail_item {
      display: inline-flex;
      align-items: center;
      min-width: 0;
      max-width: 100%;
      line-height: 20px;
    }

    .detail_item--headline .value {
      font-size: 15px;
      font-weight: 600;
      color: #2f3a4f;
    }

    .detail_item--minor {

      .title,
      .value {
        color: #667085;
      }
    }

    .amount_item {
      display: inline-flex;
      align-items: baseline;
      white-space: nowrap;

      .title {
        color: #98a2b3;
      }

      .value {
        color: #de5b5b;
        font-size: 16px;
        font-weight: 700;
      }
    }

    .title {
      font-weight: 400;
      color: #667085;
      flex-shrink: 0;
    }

    .value {
      font-weight: 400;
      color: #344054;
      min-width: 0;
      word-break: break-word;
    }
  }
}

@media (max-width: 1680px) {
  .order_row {
    .order_detail {
      .detail_line--top {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .detail_top_amount {
        justify-content: flex-start;
        margin-left: 0;
      }
    }
  }
}
</style>
