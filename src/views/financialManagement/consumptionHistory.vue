<script setup lang="ts">
defineOptions({
  name: 'consumptionHistory'
})
import moneyManagement_api from '@/api/moneyManagement/index'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import distributionConstant from '@/utils/constant/distribution'
import system_enum from '@/utils/constant/system'
const router = useRouter()
type TotherData = {
  showRecharge: Boolean
  curryInfo: API.ConsumptionHistoryParams
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
    orgId: [],
    orgName: [],
    actionType: [],
    startTime: null,
    endTime: null,
    plantOrderNo: null,
    afterSaleNo: null
  },
  facadeKz: {
    queryType: '1'
  },
  otherData: {
    showRecharge: false,
    curryInfo: {}
  },
  dataList: [],
  toDownloadCenterApi: moneyManagement_api.A_exportMerchantPrepaidDepositList,
  selectPage: moneyManagement_api.A_queryPrepaidDepositLog
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
</script>
<template>
  <PageContainer class="main_box">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <el-form-item label="操作类型">
        <SelectModel v-model.trim="dataPage.facade.actionType" :multiple="true"
          :selectList="distributionConstant.C_moneyManagementOperationType"></SelectModel>
      </el-form-item>
      <el-form-item label="创建时间">
        <DatePickerRange v-model:start="dataPage.facade.startTime" v-model:end="dataPage.facade.endTime">
        </DatePickerRange>
      </el-form-item>
      <el-form-item label="机构ID">
        <OrgSelect v-model.trim="dataPage.facade.orgId" :multiple="true" valueKey="id" valueLabel="id">
        </OrgSelect>
      </el-form-item>
      <el-form-item label="机构名称">
        <OrgSelect v-model.trim="dataPage.facade.orgName" :multiple="true" valueKey="name" valueLabel="name">
        </OrgSelect>
      </el-form-item>
      <el-form-item label="应用名称">
        <ApplicationSelect v-model.trim="dataPage.facade.appName" :multiple="true" valueKey="appName"
          valueLabel="appName">
        </ApplicationSelect>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model.trim="dataPage.facade.plantOrderNo" placeholder="请输入订单号"></el-input>
      </el-form-item>
      <el-form-item label="售后单号">
        <el-input v-model.trim="dataPage.facade.afterSaleNo" placeholder="请输入售后单号"></el-input>
      </el-form-item>
      <el-form-item label="项目类型" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade.projectTypeList" :selectList="system_enum.projectType">
        </SelectModel>
      </el-form-item>
    </SearchForm>

    <PageTable :page="dataPage.page" :listTableData="dataPage.dataList" :loading="dataPage.loadingData"
      :dataPage="dataPage" @pagingQuery="searchQueryHarder">
      <template #option>
        <AuthButton type="primary" authKey :loading="dataPage.loadingExport" @click="exportHandler">导出</AuthButton>
      </template>
      <YbtTableColumn prop="orgId" label="机构ID" min-width="160"></YbtTableColumn>
      <YbtTableColumn prop="orgName" label="机构名称" show-overflow-tooltip min-width="160"></YbtTableColumn>
      <YbtTableColumn prop="appName" label="应用名称" show-overflow-tooltip min-width="160"></YbtTableColumn>
      <YbtTableColumn prop="projectType" label="项目类型" min-width="160">
        <template #default="{ row }">{{
          system_enum.getProjectType(row.projectType)
          }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop="id" label="日志ID" min-width="160"></YbtTableColumn>
      <YbtTableColumn prop="actionType" label="操作类型" min-width="160">
        <template #default="{ row }">{{ distributionConstant.getMoneyManagementOperationType(row.actionType)
          }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop="createDate" label="创建时间" width="170"></YbtTableColumn>
      <YbtTableColumn prop="amount" label="变更金额" min-width="160">
        <template #default="{ row }">
          <span :class="row.amount >= 0 ? 'color-green' : 'color-red'">{{ `${row.amount >= 0 ? '+' :
            '-'}￥${Math.abs(row.amount)}` }}</span>
        </template>
      </YbtTableColumn>
      <YbtTableColumn prop="amountBalance" label="预存可用余额" width="160">
        <template #default="{ row }">{{ `￥${row.amountBalance}` }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop="amountCreditLine" label="固定授信概况" width="200">
        <template #default="{ row }">
          <div>总额：￥{{ row.amountCreditLine }}</div>
          <div>已用：￥{{ row.amountCreditLineUsed }}</div>
          <div>可用：￥{{ row.amountCreditLineBalance }}</div>
        </template>
      </YbtTableColumn>
      <YbtTableColumn prop="plantOrderNo" label="订单号" width="240"></YbtTableColumn>
      <YbtTableColumn prop="afterSaleNo" label="售后单号" width="240"></YbtTableColumn>
      <YbtTableColumn prop="remark" label="平台备注" show-overflow-tooltip min-width="140"></YbtTableColumn>
    </PageTable>
  </PageContainer>
</template>
<style lang="scss" scoped></style>