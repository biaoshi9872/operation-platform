<script setup lang="ts">
import moneyManagement_api from '@/api/moneyManagement/index';
import pageHooks from '@/hooks/pageListHooks';
import { IPage } from '@/types/from-types';
import distributionConstant from '@/utils/constant/distribution';
import eventBus from '@/utils/eventBus';

eventBus.on('applyFroAtopUpRecordFreshEvent', () => {
  searchQueryHarder()
})

const router = useRouter()
const $route = useRoute()
const routeConversion = () => {
  const { query } = $route
  if (query) {
    dataPage.facade.operationStatus = query.operationStatus ? parseInt(query.operationStatus) : ''
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
  selectPage: moneyManagement_api.A_queryMerchantPrepaidDepositRechargeApply
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
provide('searchQueryHandler', searchQueryHarder)
const handleSelectionChange = (value: any) => {
  dataPage.multipleList = value
}
const exportHandler = () => {
  const obj = getQueryParams()
  toDownloadCenter(obj)
}
</script>
<template>
  <div>
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <el-form-item label="交易时间">
        <DatePickerRange v-model:start="dataPage.facade.rechargeStartTime"
          v-model:end="dataPage.facade.rechargeEndTime"></DatePickerRange>
      </el-form-item>
      <el-form-item label="交易水流号">
        <el-input v-model.trim="dataPage.facade.rechargeNo"></el-input>
      </el-form-item>
      <el-form-item label="处理状态">
        <SelectModel v-model.trim="dataPage.facade.operationStatus" :multiple="false"
          :selectList="distributionConstant.C_applyOperationStatus">
        </SelectModel>
      </el-form-item>
    </SearchForm>
    <div class="option_box">
      <TableModel :page="dataPage.page" v-loading="dataPage.loadingData" :listTableData="dataPage.dataList"
        :dataPage="dataPage" @pagingQuery="searchQueryHarder">
        <template #option>
          <el-button type="primary" :loading="dataPage.loadingExport" @click="exportHandler">导出
          </el-button>
        </template>
        <YbtTableColumn prop="rechargeNo" label="交易流水号"></YbtTableColumn>
        <YbtTableColumn prop="createDate" label="交易时间" width="160"></YbtTableColumn>
        <YbtTableColumn prop="amount" label="申请充值金额"></YbtTableColumn>
        <YbtTableColumn prop label="转账方式">
          <template #default="{ row }">
            <span>线下付款</span>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop width="160">
          <template #header>
            <div>
              <div>转账凭证</div>
              <div>(点击查看大图)</div>
            </div>
          </template>
          <template #default="{ row }">
            <el-image style="width: 50px; height: 50px" :src="row.images?.split(',')?.[0]" :zoom-rate="1.2"
              :max-scale="7" :min-scale="0.2" :preview-src-list="row.images?.split(',') || []" :initial-index="4"
              fit="cover" />
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="createUserName" label="申请人"></YbtTableColumn>
        <YbtTableColumn prop label="处理状态">
          <template #default="{ row }">{{ distributionConstant.getApplyOperationStatus(row.operationStatus)
            }}</template>
        </YbtTableColumn>
      </TableModel>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>