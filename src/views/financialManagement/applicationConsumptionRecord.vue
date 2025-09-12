<script setup lang="ts">
defineOptions({
    name: 'consumptionHistory'
})
import moneyManagement_api from '@/api/moneyManagement/index'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import distributionConstant from '@/utils/constant/distribution'
import system_enum from '@/utils/constant/system'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()

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
        plantOrderNo: null
    },
    facadeKz: {
        queryType: '2'
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
            <el-form-item label="应用编码">
                <el-input v-model.trim="dataPage.facade.appCode" placeholder="请输入应用编码"></el-input>
            </el-form-item>
            <el-form-item label="应用名称">
                <ApplicationSelect v-model.trim="dataPage.facade.appName" :multiple="true" valueKey="appName"
                    valueLabel="appName">
                </ApplicationSelect>
            </el-form-item>
            <el-form-item label="操作类型">
                <SelectModel v-model.trim="dataPage.facade.actionType" :multiple="true"
                    :selectList="distributionConstant.C_moneyManagementOperationType1"></SelectModel>
            </el-form-item>
            <el-form-item label="创建时间">
                <DatePickerRange v-model:start="dataPage.facade.startTime" v-model:end="dataPage.facade.endTime">
                </DatePickerRange>
            </el-form-item>
            <el-form-item v-if="getSystemOptionType == '101'" label="机构名称">
                <OrgSelect v-model.trim="dataPage.facade.orgName" :multiple="true" valueKey="name" valueLabel="name">
                </OrgSelect>
            </el-form-item>
            <el-form-item label="订单号">
                <el-input v-model.trim="dataPage.facade.plantOrderNo"></el-input>
            </el-form-item>
            <el-form-item label="项目类型" class="formItem" placeholder="请选择">
                <SelectModel v-model.trim="dataPage.facade.projectTypeList" :selectList="system_enum.projectType">
                </SelectModel>
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" :loading="dataPage.loadingData"
                :dataPage="dataPage" @pagingQuery="searchQueryHarder">
                <template #option>
                    <AuthButton type="primary" authKey :loading="dataPage.loadingExport" @click="exportHandler">导出
                    </AuthButton>
                    <Notices title="应用交易明细以平台分销价为结算依据。"></Notices>
                </template>
                <YbtTableColumn v-if="getSystemOptionType == '101'" prop="orgName" label="机构名称" show-overflow-tooltip
                    mix-width="140">
                </YbtTableColumn>
                <YbtTableColumn prop="appCode" label="应用编码" show-overflow-tooltip mix-width="140"></YbtTableColumn>
                <YbtTableColumn prop="appName" label="应用名称" show-overflow-tooltip mix-width="140"></YbtTableColumn>
                <YbtTableColumn prop="projectType" label="项目类型" mix-width="140">
                    <template #default="{ row }">{{
                        system_enum.getProjectType(row.projectType)
                    }}</template>
                </YbtTableColumn>
                <YbtTableColumn prop="id" label="日志ID" mix-width="120"></YbtTableColumn>
                <YbtTableColumn prop="actionType" label="操作类型" mix-width="120">
                    <template #default="{ row }">{{
                        distributionConstant.getMoneyManagementOperationType1(row.actionType)
                    }}</template>
                </YbtTableColumn>
                <YbtTableColumn prop="createDate" label="创建时间" mix-width="160"></YbtTableColumn>
                <YbtTableColumn prop="retailAmount" label="变更金额" mix-width="160">
                    <template #default="{ row }">
                        <span :class="row.retailAmount >= 0 ? 'color-green' : 'color-red'">{{ `${row.retailAmount >= 0 ?
                            '+' :
                            '-'}￥${Math.abs(row.retailAmount)}` }}</span>
                    </template>
                </YbtTableColumn>
                <YbtTableColumn prop="plantOrderNo" label="订单号" width="240"></YbtTableColumn>
                <YbtTableColumn prop="remark" label="平台备注" show-overflow-tooltip mix-width="140"></YbtTableColumn>
            </TableModel>
        </div>
    </PageContainer>
</template>
<style lang="scss" scoped></style>