<script setup lang="ts">
defineOptions({
  name: 'financialTopUps'
})
import moneyManagement_api from '@/api/moneyManagement/index'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import distributionConstant from '@/utils/constant/distribution'
import RechargeDiag from './components/RechargeDiag.vue'
const router = useRouter()
type TotherData = {
  showRecharge: Boolean
  curryInfo: API.MerchantPrepaidRecording
}
const dataPage: IPage<any, any> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    orgId: [],
    orgName: [],
    prepaidDepositLimitFlag: ''
  },
  facadeKz: {
    active: '1'
  },
  otherData: {
    showRecharge: false,
    curryInfo: {}
  },
  tagList: [],
  dataList: [],
  toDownloadCenterApi: moneyManagement_api.A_merchantPrepaidDepositExport,
  selectPage: moneyManagement_api.A_queryMerchantPrepaidDepositList
})
const { otherData } = toRefs<{ otherData: TotherData }>(dataPage as any)
const { searchQuery, downloadFile, toDownloadCenter } = pageHooks(dataPage)
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
//充值
const rechargeHandler = (row: API.MerchantPrepaidRecording) => {
  otherData.value.showRecharge = true
  otherData.value.curryInfo = row
}
</script>
<template>
  <PageContainer class="main_box">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <el-form-item label="机构ID">
        <OrgSelect v-model.trim="dataPage.facade.orgId" :multiple="true" valueKey="id" valueLabel="id">
        </OrgSelect>
      </el-form-item>
      <el-form-item label="机构名称">
        <OrgSelect v-model.trim="dataPage.facade.orgName" :multiple="true" valueKey="name" valueLabel="name">
        </OrgSelect>
      </el-form-item>
      <el-form-item label="客户名称">
        <OrgSelect v-model.trim="dataPage.facade.customerName" :multiple="true" valueKey="customerName"
          valueLabel="customerName">
        </OrgSelect>
      </el-form-item>
      <el-form-item label="预存款限制">
        <el-select v-model.trim="dataPage.facade.prepaidDepositLimitFlag" filterable clearable>
          <el-option value label="全部"></el-option>
          <el-option v-for="(item, index) in distributionConstant.prepaidDepositLimitFlagList" :value="item.value"
            :label="item.label"></el-option>
        </el-select>
      </el-form-item>
    </SearchForm>
    <PageTable :page="dataPage.page" :loading="dataPage.loadingData" :listTableData="dataPage.dataList"
      :dataPage="dataPage" @pagingQuery="searchQueryHarder">
      <template #option>
        <AuthButton type="primary" authKey :loading="dataPage.loadingExport" @click="exportHandler">导出</AuthButton>
      </template>
      <YbtTableColumn prop="orgId" label="机构ID"></YbtTableColumn>
      <YbtTableColumn prop="orgName" label="机构名称"></YbtTableColumn>
      <YbtTableColumn prop="customerName" label="客户名称"></YbtTableColumn>
      <YbtTableColumn prop="amountRechargeTotal" label="累计充值(元)" min-width="140"></YbtTableColumn>
      <YbtTableColumn prop="amountUsedTotal" label="已用额度(预存款)(元)" min-width="160"></YbtTableColumn>
      <YbtTableColumn prop="amountBalance" label="预存款账户余额(元)" min-width="160"></YbtTableColumn>
      <YbtTableColumn prop="amountFreeze" label="冻结金额(元)" min-width="160"></YbtTableColumn>
      <YbtTableColumn prop="amountCreditLine" label="授信额度(元)" min-width="160"></YbtTableColumn>
      <YbtTableColumn prop="prepaidDepositLimitFlag" label="是否预存款限制" min-width="160">
        <template #default="{ row }">{{ distributionConstant.getPrepaidDepositLimitFlag(row.prepaidDepositLimitFlag)
        }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop label="操作" fixed="right" align="right" min-width="100">
        <template #default="{ row }">
          <AuthButton type="text" authKey @click="rechargeHandler(row)">充值</AuthButton>
        </template>
      </YbtTableColumn>
    </PageTable>
    <RechargeDiag v-model="dataPage.otherData.showRecharge" :curryInfo="dataPage.otherData.curryInfo"></RechargeDiag>
  </PageContainer>
</template>
<style lang="scss" scoped></style>