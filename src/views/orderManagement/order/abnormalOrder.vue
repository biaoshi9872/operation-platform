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
import configH5_api from '@/api/configH5'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
const tabsStoreInfo: any = tabsStore()
const $routerStore: any = useRouterStore()
const $userStore = useUserStore()
const authDir = resolveDirective('auth')
const $route = useRoute()
const dataPage: IPage<any, any> = reactive({
  isOnload: false,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    skuCode: '', //
    orgIdList: [], //应用进入应用的时候要传
  
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
   
    orderStatusList: [],
    desensitizationStatus: '', //面单是否脱
  },
  facadeKz: {
    tab: '-1',
    channelSourceList: [63], //武大项目定制
    appIdList: [],//appID
  },
  dataList: [],
  toDownloadCenterApi: order_api.A_orderExport,
  selectPage: order_api.A_page,
})
const { searchQuery, toDownloadCenter } = pageHooks(dataPage)

const getQueryParams = () => {
  const { page, facade, facadeKz } = dataPage
  return { ...page, ...facade, ...facadeKz }
}
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}

/**
 * 导出
 */
const exportHandler = () => {
  const obj = getQueryParams()
  toDownloadCenter(obj)
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

const columns: any = ref([])

onMounted(async () => {
    //1. 武大项目动态配置
  const systemConfig: any = await configH5_api.A_getSysConfigList({
    page: 1,
    limit: 10,
    name: '',
    key: 'SYS_WD_APP_ID'
  })
  let appIdList: string[] = systemConfig?.page?.records?.[0]?.paramValue?.split(',') ||[]
  dataPage.facadeKz.appIdList = appIdList
  searchQueryHarder()
  initColumns()
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
      return h('div', {}, [goodsDetail])
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

    if (['101'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '机构名称',
      prop: 'orgName',
      align: 'center',
      'min-width': '120px',
      openMarginCell: true
    })
  }

    if ([ '101','201'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '应用名称',
      prop: 'appName',
      align: 'center',
      'min-width': '120px',
      openMarginCell: true
    })
  }

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
      const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
      return h('div', { style }, [detailButton])
    }
  })
}

</script>
<template>
  <PageContainer class="main_box">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder" :customReset="true" @reset="searchQueryHarder">
      <el-form-item label="提交订单时间" class="el-form-item-inputGroup">
        <DatePickerRange v-model:start="dataPage.facade.submitTimeStart" v-model:end="dataPage.facade.submitTimeEnd">
        </DatePickerRange>
      </el-form-item>
      <el-form-item label="确认下单时间" class="el-form-item-inputGroup">
        <DatePickerRange v-model:start="dataPage.facade.confirmTimeStart" v-model:end="dataPage.facade.confirmTimeEnd">
        </DatePickerRange>
      </el-form-item>
      <el-form-item v-if="['10', '101', '20', '201'].includes(getSystemOptionType)" label="订单编号" class="formItem"
        placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.orderNo" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.skuName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编码" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.skuCode" placeholder="请输入商品编码"></el-input>
      </el-form-item>
      <el-form-item label="收货人姓名" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.receiverName" placeholder="请输入收货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="收货人手机号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.receiverPhone" placeholder="请输入收货人手机号"></el-input>
      </el-form-item>
      <el-form-item label="是否脱敏发货" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade.desensitizationStatus" :selectList="order_enum.C_isMaskList">
        </SelectModel>
      </el-form-item>
      <el-form-item :label="getSystemOptionType == 401 ? '订单编号' : '供应商订单编号'" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.channelOrderNo"
          :placeholder="getSystemOptionType == 401 ? '请输入订单编号' : '请输入供应商订单编号'"></el-input>
      </el-form-item>
      <el-form-item label="第三方订单编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.thirdOrderNo" placeholder="请输入第三方订单编号"></el-input>
      </el-form-item>
      <el-form-item label="电商订单编号(子单)" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.outTradeNo" placeholder="请输入电商订单编号(子单)"></el-input>
      </el-form-item>
    </SearchForm>
    <OrderTable class="order-container" :openFold="false" :openERP="true" :border="true" :dataPage="dataPage"
      :dataList="dataPage.dataList" orderChildAttr="goodsList" :columns="columns">
      <template #option>
        <AuthButton authKey="VO_ORDER_EXPORT" type="primary" @click="exportHandler" :loading="dataPage.loadingExport">导出
        </AuthButton>
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
              <span v-if="getSystemOptionType == 101" class="detail_item">
                <span class="title">供应商名称:</span>
                <span class="value">{{ row.supplyName ?? '-' }}</span>
              </span>
              </div>
              <div class="detail_top_amount">
                <span class="amount_item">
                  <span class="title">订单总金额:</span>
                  <span class="value">￥{{ row.totalAmount }}</span>
                  <el-divider direction="vertical" />
                </span>
              </div>            
            </div>
          </div>
        </div>
      </template>
    </OrderTable>
    <CustomPagination @pagingQuery="searchQueryHarder" :page="dataPage.page"></CustomPagination>
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
