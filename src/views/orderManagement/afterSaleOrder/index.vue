<script setup lang='ts'>
defineOptions({ name: 'orderList' })
import after_api from '@/api/afterOrder/index'
import SkuDetail from '@/components/SkuDetail/index.vue'
import StateCell from '@/components/Tooltip/StateCell.vue'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import pageHooks from '@/hooks/pageListHooks'
import { tabsStore } from '@/stores'
import { IPage } from '@/types/from-types'
import goodPoor from '@/utils/constant/goodPoor'
import order_enum from '@/utils/constant/order'
import { ElButton } from 'element-plus'
import { ref, resolveDirective, withDirectives } from 'vue'
import AuthModel from './modelComponents/AuthModel.vue'
import AuthModelZY from './modelComponents/AuthModelZY.vue'
import RevokeModel from './modelComponents/RevokeModel.vue'
const { isFromOrgLast, getSystemOptionType } = isStateCheckHooks()
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
  selectPage: after_api.A_queryPage,
  defaultValueConversion: routeConversion,
  toDownloadCenterApi: after_api.A_AfterOrderExport,
  dataList: [],
  multipleList: [],
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  isOnload: true,
  facade: {
    orgIdList: [],
    appIdList: [],
    afterSaleTypeList: [], //售后类型
    statusList: [], //售后单状态
    applyTimeStart: '', //申请时间起
    applyTimeEnd: '', //申请时间止
    channelOrderNo: '', //渠道订单号
    channelAfterSaleNo: '', //渠道售后单号
    skuName: '', //商品名称
    skuCode: '', //商品编码
    supplierIdList: [], //供应商
    desensitizationStatus: null, //是否脱敏
    afterSaleNo: ''
  },
  facadeKz: {
    activeName: '1'
  },
  showAuthModel: false,
  title: '',
  showRevokeModel: false,
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
      afterSaleNo: row.afterSaleNo
    }
  })
}
// 审核
const authHandler = (row: any, title: string) => {
  dataPage.curryInfo = row
  dataPage.title = title
  dataPage.showAuthModel = true
}
//撤销
const revocationHandler = (row: any) => {
  dataPage.curryInfo = row
  dataPage.showRevokeModel = true
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
    width: '300px',
    align: 'left',
    render: (row: any, props: any) => {
      let newRow = row
      let spec = row.channelSource == 104 ? (row.attributeValue1 || '') + (row.attributeValue2 || '') : ''
      newRow.titleSpec = row.skuName + spec
      return h(SkuDetail, {
        goodDetail: newRow,
        showExtraCode: false,
        customAttribute: {
          url: 'images',
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
      prop: 'platformPurchasePrice',
      align: 'center',
      width: '130px',
      render: (row: any) => {
        return h('div', `￥${row.platformPurchasePrice ?? ''}`)
      }
    })
  }
  columns.value.push({
    label: getSystemOptionType.value == 401 ? '含税供应价' : '平台供应价',
    align: 'center',
    width: '130px',
    prop: 'platformSupplyPrice',
    render: (row: any) => {
      return h('div', `￥${row.platformSupplyPrice ?? ''}`)
    }
  })
  if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) {
    columns.value.push({
      label: '分销价',
      align: 'center',
      width: '130px',
      prop: 'retailPrice',
      render: (row: any) => {
        return h('div', `￥${row.retailPrice ?? ''}`)
      }
    })
  }
  columns.value.push({
    label: '销售单位',
    align: 'center',
    width: '100px',
    prop: 'unit'
  })
  if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) (columns.value.push({
    label: '商品类型',
    align: 'center',
    width: '100px',
    prop: 'channelSource',
    render: (row: any) => {
      return h('div', goodPoor.getSourceTypeNameByKey(row.channelSource))
    }
  })
  )
  columns.value.push({
    label: '售后类型',
    align: 'center',
    width: '100px',
    prop: 'afterSaleType',
    render: (row: any) => {
      return h('div', order_enum.getAfterSalesTypeTitle(row.afterSaleType))
    }
  })

  columns.value.push({
    label: '售后状态',
    align: 'center',
    prop: 'status',
    render: (row: any) => {
      return h('div', order_enum.getAfter_order_statesTitle(row.status))
    }
  })

  //顶级机构
  if (getSystemOptionType.value == '101') {
    columns.value.push({
      label: '分支机构',
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
    label: '操作',
    align: 'center',
    render: (row: any) => {
      //电商审核逻辑
      let authButton = null
      if (goodPoor.D_sourceTypeList.includes(row.channelSource)) {
        //1.：待售后审核 2：待用户上传物流信息 3：供应商上传物流信息 4：待供应商确认收货 5：待用户确认收货 6：待售后确认
        //1.退货退款   审核 上传退货物流 供应商确认收货  确认退款
        //2.换货      审核  上传退货物流 供应商确认收货 供应商上传发货物流 用户确认收货
        //3.仅退款：   审核 确认退款
        let title = ''
        switch (row.afterNode) {
          case 1:
            title = '审核'
            break
          case 2:
            title = '上传退货物流'
            break
          case 3:
            title = '上传发货物流'
            break
          case 4:
            title = '确认收货'
            break
          case 5:
            title = '用户确认收货'
            break
          case 6:
            title = '确认退款'
            break
        }
        authButton = withDirectives(
          h(ElButton, {
            type: 'text',
            innerText: title,
            onClick: () => {
              authHandler(row, title)
            }
          }),
          [
            [
              authDir,
              {
                authKey: 'AFTER_ORDER_SH',
                detail: row
              }
            ]
          ]
        )
      }
      //撤销
      const revocationButton = [1].includes(row.status) && ![104].includes(row.channelSource) &&
        withDirectives(
          h(ElButton, {
            type: 'text',
            innerText: '撤销',
            onClick: () => {
              revocationHandler(row)
            }
          }),
          [
            [
              authDir,
              {
                authKey: 'AFTER_ORDER_CX',
                detail: row
              }
            ]
          ]
        )
      //详情
      const detailButton = h(ElButton, {
        type: 'text',
        innerText: '详情',
        onClick: () => {
          toDetailHandler(row)
        }
      })
      const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
      return h('div', { style }, [authButton, revocationButton, detailButton])
    }
  })
}
</script>

<template>
  <PageContainer v-loading="dataPage.loadingData">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <el-form-item label="售后类型" class="formItem">
        <SelectModel v-model.trim="dataPage.facade.afterSaleTypeList" :selectList="order_enum.AfterSalesType">
        </SelectModel>
      </el-form-item>
      <el-form-item label="售后状态" class="formItem">
        <SelectModel v-model.trim="dataPage.facade.statusList" :multiple="true"
          :selectList="order_enum.after_order_states"></SelectModel>
      </el-form-item>
      <el-form-item label="申请时间" class="el-form-item-inputGroup">
        <DatePickerRange v-model:start="dataPage.facade.applyTimeStart" v-model:end="dataPage.facade.applyTimeEnd">
        </DatePickerRange>
      </el-form-item>
      <el-form-item :label="getSystemOptionType == 401 ? '售后编号' : '渠道售后编号'" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.channelAfterSaleNo"
          :placeholder="getSystemOptionType == 401 ? '请输入售后单编号' : '请输入渠道售后单编号'"></el-input>
      </el-form-item>
      <el-form-item v-if="getSystemOptionType != 401" label="售后编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.afterSaleNo" placeholder="请输入售后编号"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.skuName" placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item v-if="getSystemOptionType != 401" label="渠道订单编号" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.channelOrderNo" placeholder="请输入渠道订单编号"></el-input>
      </el-form-item>
      <el-form-item label="商品编码" class="formItem" placeholder="请选择">
        <el-input v-model.trim="dataPage.facade.skuCode" placeholder="请输入商品编码"></el-input>
      </el-form-item>
      <el-form-item v-if="(['10', '101'].includes(getSystemOptionType))" label="供应商" class="formItem" placeholder="请选择">
        <AffiliatedSupplier v-model.trim="dataPage.facade.supplierIdList" :mode="1" :hasJdChance="true">
        </AffiliatedSupplier>
      </el-form-item>
      <el-form-item v-if="['101'].includes(getSystemOptionType)" label="分支机构" class="formItem" placeholder="请选择">
        <OrgSelect v-model.trim="dataPage.facade.orgIdList" :multiple="true"></OrgSelect>
      </el-form-item>
      <el-form-item v-if="['101', '201'].includes(getSystemOptionType)" label="应用名称" class="formItem" placeholder="请选择">
        <ApplicationSelect v-model.trim="dataPage.facade.appIdList" :multiple="true" valueKey="id"></ApplicationSelect>
      </el-form-item>
      <el-form-item label="是否脱敏发货" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade.desensitizationStatus" :selectList="order_enum.C_isMaskList">
        </SelectModel>
      </el-form-item>
    </SearchForm>
    <OrderCustomTable class="order-container" :openERP="false" :openFold="false" :border="true" :dataPage="dataPage"
      :dataList="dataPage.dataList" :columns="columns">
      <template #option>
        <el-button authKey="VO_AFTERWORD_EXPORT" type="primary" @click="exportHandler"
          :loading="dataPage.loadingExport">导出</el-button>
      </template>
      <template #customRow="{ row }">
        <div class="order_row">
          <div class="order_detail">
            <span> {{ getSystemOptionType == 401 ?
              '售后单编号:' : '渠道售后单编号:' }} {{ row.channelAfterSaleNo
              }}</span>
            <span v-if="getSystemOptionType != 401">渠道订单编号:{{ row.channelOrderNo }}</span>
            <span v-if="getSystemOptionType != 401">售后单编号:{{ row.afterSaleNo }}</span>
            <span>申请时间:{{ row.applyTime }}</span>
            <span v-if="getSystemOptionType == 101">供应商:{{ row.supplyName }}</span>
            <span v-else-if="getSystemOptionType == 201 && row.channelSource == 105">供应商:{{ row.supplyName }}</span>
          </div>
        </div>
      </template>
    </OrderCustomTable>
    <CustomPagination @pagingQuery="pagingQueryHarder" :page="dataPage.page"></CustomPagination>
    <AuthModel v-model="dataPage.showAuthModel" :curryInfo="dataPage.curryInfo" :title="dataPage.title"
      @refresh="searchQueryHarder">
    </AuthModel>
    <AuthModelZY v-model="dataPage.showAuthModelZy" :curryInfo="dataPage.curryInfo" @refresh="searchQueryHarder">
    </AuthModelZY>
    <RevokeModel v-model="dataPage.showRevokeModel" :curryInfo="dataPage.curryInfo" @refresh="searchQueryHarder">
    </RevokeModel>
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