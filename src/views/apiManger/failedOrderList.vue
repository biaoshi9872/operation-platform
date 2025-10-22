<script setup lang="ts">
defineOptions({
  name: 'failedOrderList'
})

import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import { ref } from 'vue'
import apiLinkProduct from '@/api/apiLinkProduct'
import OrderRetryModel from './components/OrderRetryModel.vue'
import UserInfo from './components/UserInfo.vue'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()

const routeConversion = () => { }
const dataPage: IPage<API.T_YiChangDingDanLieBiaoSearchForm, any> = reactive({
  defaultValueConversion: routeConversion,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    appIds: null, //分销
    orgIds: null, //分支机构
    ybtOrderNo: '', //驿宝通订单号
    channelOrderNo: '', //渠道订单号
    skuCode: '', //商品编码
    outSkuCode: '', //外部商品编码
    skuName: '', //商品名称
    outSkuName: '', //外部商品名称
    submitTimeStart: '', //提交时间起
    submitTimeEnd: '', //提交时间止
    confirmTimeStart: '', //确认时间起
    confirmTimeEnd: '', //确认时间止
    receiverName: '', //收货人姓名
    receiverPhone: '', //收货人手机
    address: '' //收货人地址
  },
  isOnload: true,
  retryModel: false,
  curryInfo: null,
  viewGoodsModel: false,
  facadeKz: {},
  dataList: [],
  viewGoodsList: [],
  toDownloadCenterApi: apiLinkProduct.A_exportException,
  selectPage: apiLinkProduct.A_retryPage
})
const { searchQuery, toDownloadCenter, handleSelectionChange } = pageHooks(dataPage)

/**查询参数 */
const getQueryParams = () => {
  const { page, facade, facadeKz } = dataPage
  return { ...page, ...facade, ...facadeKz }
}

// 查询回调
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}
//导出
const exportHandler = () => {
  const obj = getQueryParams()
  toDownloadCenter(obj)
}
//重试
const retryHandler = (row: any) => {
  dataPage.curryInfo = row
  dataPage.retryModel = true
}

// 查看商品
const viewGoodsHandler = (row: any) => {
  dataPage.curryInfo = row
  // 查看异常订单商品详情
  apiLinkProduct.A_getExceptionOrderProductDetail({
    exOrderId: row.id
  }).then(res => {
    dataPage.viewGoodsList = res || []
    dataPage.viewGoodsModel = true
  })
}

// 统计商品总数量（来自 details.goodsNum 合计）
const getTotalGoodsNum = (row: any) => {
  const list = row?.details || []
  return list.reduce((sum: number, item: any) => sum + (item?.goodsNum || 0), 0)
}

//关键字变化
const keySelectChange = (key: string, select: string) => {
  keySelectList.forEach(item => {
    dataPage.facade[item.value] = ''
  })
  dataPage.facade[select] = key
}

const keySelectRef = ref(null) as any
const keySelectList = [
  {
    label: '收货人姓名',
    value: 'receiverName'
  },
  {
    label: '收货人手机',
    value: 'receiverPhone'
  },
  {
    label: '收货人地址',
    value: 'address'
  }
]
//重置
const reset = () => {
  keySelectRef.value.reSetHandler()
}
//关闭查看商品
const handleClose = () => {
  dataPage.viewGoodsModel = false
}

</script>

<template>
  <PageContainer class="home">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder" @reset="reset">
      <el-form-item label="应用名称">
        <ApplicationSelect v-model="dataPage.facade.appIds" :multiple="true"></ApplicationSelect>
      </el-form-item>
      <el-form-item label="分支机构" v-if="['101'].includes(getSystemOptionType)">
        <OrgSelect v-model="dataPage.facade.orgIds" :multiple="true"></OrgSelect>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input v-model="dataPage.facade.orderNo" placeholder="请输入订单编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="第三方订单编号">
        <el-input v-model="dataPage.facade.thirdOrderNo" placeholder="请输入第三方订单编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品编码">
        <el-input v-model="dataPage.facade.skuCode" placeholder="请输入商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="外部商品编码">
        <el-input v-model="dataPage.facade.outSkuCode" placeholder="请输入外部商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="dataPage.facade.skuName" placeholder="请输入商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="外部商品名称">
        <el-input v-model="dataPage.facade.outSkuName" placeholder="请输入外部商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="提交订单时间">
        <DatePickerRange v-model:start="dataPage.facade.submitTimeMin" v-model:end="dataPage.facade.submitTimeMax" />
      </el-form-item>
      <el-form-item label="确认订单时间">
        <DatePickerRange v-model:start="dataPage.facade.confirmTimeMin" v-model:end="dataPage.facade.confirmTimeMax" />
      </el-form-item>
      <el-form-item label="关键字">
        <KeySelect ref="keySelectRef" @keySelectChange="keySelectChange" :keySelectList="keySelectList"></KeySelect>
      </el-form-item>
    </SearchForm>
    <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder"
      :loading="dataPage.loadingData" @selection-change="handleSelectionChange">
      <template #option>
        <AuthButton authKey="API_FAILED_EXPORT" :loading="dataPage.loadingExport" type="primary" @click="exportHandler">
          导出</AuthButton>
      </template>
      <el-table-column label="应用名称" prop="appName" show-overflow-tooltip min-width="150px"
        align="left"></el-table-column>
      <el-table-column label="分支机构" v-if="['101'].includes(getSystemOptionType)" prop="orgName" show-overflow-tooltip
        min-width="150px" align="left"></el-table-column>
      <el-table-column label="失败原因" prop="errMsg" show-overflow-tooltip min-width="180px" align="left" />
      <el-table-column label="订单编号" prop="orderNo" min-width="180px" align="left" />
      <el-table-column label="第三方订单编号" prop="thirdOrderNo" min-width="180px" align="left" />
      <el-table-column label="提交订单时间" prop="createTime" min-width="130px" align="left" />
      <el-table-column label="确认订单时间" prop="confirmTime" min-width="130px" align="left" />
      <el-table-column label="收货人信息" width="220px" align="left">
        <template #default="{ row }">
          <UserInfo :row="row" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80px" align="right" fixed="right">
        <template #default="{ row }">
          <AuthButton authKey="API_FAILED_REPAT" type="text" @click="retryHandler(row)">重试</AuthButton>
          <AuthButton authKey="API_FAILED_LOOK" type="text" @click="viewGoodsHandler(row)">查看商品</AuthButton>
        </template>
      </el-table-column>
    </TableModel>
    <!-- 商品明细弹窗 -->
    <el-dialog v-model="dataPage.viewGoodsModel" title="商品明细" width="750px" append-to-body @close="handleClose">
      <el-table :data="dataPage.viewGoodsList || []" size="small" max-height="400px" border style="width: 100%">
        <el-table-column label="驿宝通商品编码" prop="skuCode" min-width="140px" align="left" />
        <el-table-column label="外部商品编码" prop="outSkuCode" min-width="160px" align="left" />
        <el-table-column label="驿宝通商品名称" prop="skuName" show-overflow-tooltip min-width="160px" align="left" />
        <el-table-column label="外部商品名称" prop="outSkuName" show-overflow-tooltip min-width="160px" align="left" />
        <el-table-column label="数量" prop="goodsNum" min-width="100px" align="left" />
      </el-table>
    </el-dialog>
    <OrderRetryModel v-model="dataPage.retryModel" :curryInfo="dataPage.curryInfo" @refresh="searchQueryHarder">
    </OrderRetryModel>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
