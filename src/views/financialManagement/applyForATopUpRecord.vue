<script setup lang="ts">
defineOptions({
  name: 'applyForATopUpRecord'
})
import moneyManagement_api from '@/api/moneyManagement/index'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import distributionConstant from '@/utils/constant/distribution'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
type TotherData = {
  showRecharge: Boolean
  curryInfo: API.applyForATopUpRecordRecording
}
const $route = useRoute()
const routeConversion = () => {
  const { query } = $route
  if (query) {
    dataPage.facade.operationStatus = query.operationStatus ? query.operationStatus : ''
  }
}

const dataPage: IPage<any, any> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    merchantId: [],
    orgName: [],
    operationStatus: null,
    rechargeStartTime: null,
    rechargeEndTime: null,
    rechargeNo: null
  },
  facadeKz: {
    active: '1'
  },
  otherData: {
    showRecharge: false,
    curryInfo: {}
  },
  dataList: [],
  defaultValueConversion: routeConversion,
  toDownloadCenterApi: moneyManagement_api.A_exportPrepaidDepositRechargeApply,
  selectPage: moneyManagement_api.A_queryPrepaidDepositRechargeApply
})
const { searchQuery, toDownloadCenter } = pageHooks(dataPage)
const { otherData } = toRefs<{ otherData: TotherData }>(dataPage as any)
const getQueryParams = () => {
  const { page, facade, facadeKz } = dataPage
  return { ...page, ...facade, ...facadeKz }
}
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}
provide('searchQueryHandler', searchQueryHarder)
const exportHandler = () => {
  const obj = getQueryParams()
  toDownloadCenter(obj)
}
const disposeHandler = (row: API.applyForATopUpRecordRecording) => {
  ElMessageBox.confirm(`确定是否已完成该笔充值?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const { rechargeNo } = row
    moneyManagement_api.A_processPrepaidDepositRechargeApply({ rechargeNo }).then(res => {
      ElMessage.success('操作成功')
      searchQueryHarder()
    })
  })
}
</script>
<template>
  <PageContainer class="main_box">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <el-form-item label="起止日期">
        <DatePickerRange v-model:start="dataPage.facade.rechargeStartTime"
          v-model:end="dataPage.facade.rechargeEndTime"></DatePickerRange>
      </el-form-item>
      <el-form-item label="交易流水号">
        <el-input v-model.trim="dataPage.facade.rechargeNo" placeholder="请输入交易流水号"></el-input>
      </el-form-item>
      <el-form-item label="机构ID">
        <OrgSelect v-model.trim="dataPage.facade.orgId" placeholder="请选择机构ID" :multiple="true" valueKey="id"
          valueLabel="id">
        </OrgSelect>
      </el-form-item>
      <el-form-item label="机构名称">
        <OrgSelect v-model.trim="dataPage.facade.orgName" placeholder="请选择机构名称" :multiple="true" valueKey="name"
          valueLabel="name">
        </OrgSelect>
      </el-form-item>
      <el-form-item label="客户名称">
        <OrgSelect v-model.trim="dataPage.facade.customerName" :multiple="true" valueKey="customerName"
          valueLabel="customerName" placeholder="请选择客户名称"></OrgSelect>
      </el-form-item>
      <el-form-item label="处理状态">
        <SelectModel v-model.trim="dataPage.facade.operationStatus" placeholder="请选择处理状态"
          :selectList="distributionConstant.C_applyOperationStatus"></SelectModel>
      </el-form-item>
    </SearchForm>
    <PageTable :page="dataPage.page" :listTableData="dataPage.dataList" :dataPage="dataPage"
      @pagingQuery="searchQueryHarder">
      <template #option>
        <AuthButton type="primary" authKey :loading="dataPage.loadingExport" @click="exportHandler">导出</AuthButton>
      </template>
      <YbtTableColumn prop="orgId" label="机构ID" min-width="120"></YbtTableColumn>
      <YbtTableColumn prop="orgName" label="机构名称" min-width="140" show-overflow-tooltip></YbtTableColumn>
      <YbtTableColumn prop="customerName" label="客户名称" show-overflow-tooltip></YbtTableColumn>
      <YbtTableColumn prop="rechargeNo" label="交易流水号" min-width="140"></YbtTableColumn>
      <YbtTableColumn prop="createDate" label="交易时间" width="160"></YbtTableColumn>
      <YbtTableColumn prop="amount" label="申请充值金额" width="140">
        <template #default="{ row }">￥{{ row.amount }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop="createDate" label="转账凭证" align="center" width="140">
        <template #header>
          <div>
            <div>转账凭证</div>
            <div>(点击查看大图)</div>
          </div>
        </template>
        <template #default="{ row }">
          <el-image style="width: 50px; height: 50px" :src="row.images?.split(',')?.[0]" :zoom-rate="1.2" :max-scale="7"
            :min-scale="0.2" :preview-src-list="row.images?.split(',') || []" :initial-index="4" fit="cover" />
        </template>
      </YbtTableColumn>
      <YbtTableColumn prop="operationStatus" label="处理状态" width="100">
        <template #default="{ row }">{{ row.operationStatus === 1 ? '已处理' : '未处理' }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop label="操作" fixed="right" align="right" width="100">
        <template #default="{ row }">
          <el-button v-if="row.operationStatus !== 1" type="text" @click="disposeHandler(row)">已处理</el-button>
        </template>
      </YbtTableColumn>
    </PageTable>
  </PageContainer>
</template>
<style lang="scss" scoped></style>