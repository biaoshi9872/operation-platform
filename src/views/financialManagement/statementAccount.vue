<script setup lang="ts">
defineOptions({
    name: 'StatementAccount'
})
import { reactive } from 'vue'
import pageHooks from '@/hooks/pageListHooks'
import moneyManagement_api from '@/api/moneyManagement'
const router = useRouter()

// 列表页数据模型
const dataPage = reactive<IPage<any, API.OpenBillPageRecord>>({
    isOnload: true,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {
        billDate: '',   // YYYY-MM
        billNO: '',
        orgId: '',
        appId: ''       // 使用 ApplicationSelect 选择的应用 id
    },
    facadeKz: {},
    dataList: [],
    toDownloadCenterApi: moneyManagement_api.A_openExportBill,
    selectPage: moneyManagement_api.A_openBillPage
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

const exportHandler = () => {
    const obj = getQueryParams()
    toDownloadCenter(obj)
}

const goDetail = (row: API.OpenBillPageRecord) => {
    router.push({
        path: '/financialManagement/statementAccountDetail',
        query: {
            billNo: String(row.billNo || ''),
            billDate: String(dataPage.facade.billDate || row.billDate || ''),
            appId: String(dataPage.facade.appId || ''),
            orgId: String(dataPage.facade.orgId || '')
        }
    })
}
</script>

<template>
    <PageContainer class="main_box">
        <!-- 搜索区 -->
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="账单月份">
                <el-date-picker v-model="dataPage.facade.billDate" type="month" placeholder="选择月份"
                    value-format="YYYY-MM" clearable />
            </el-form-item>
            <el-form-item label="应用名称">
                <ApplicationSelect v-model="dataPage.facade.appId" :multiple="false" valueKey="id"
                    valueLabel="appName" />
            </el-form-item>
            <el-form-item label="账单编号">
                <el-input v-model.trim="dataPage.facade.billNO" placeholder="请输入账单编号" clearable />
            </el-form-item>
            <el-form-item label="所属分支机构">
                <OrgSelect v-model="dataPage.facade.orgId" />
            </el-form-item>
        </SearchForm>

        <!-- 说明文案（根据截图补充） -->
        <el-alert type="info" show-icon :closable="false" class="mb12">
            <template #title>
                <div>账单说明：</div>
                <div>1. 账单以外的维度展示，每天凌晨更新T-3的订单数据，已确认的订单（下单成功）为正常水，售后已完结的订单将会包含在流水记录（账款除外）。</div>
                <div>2. 每个应用一个账单。</div>
                <div>3. 账单数据仅供参考，具体的结算以结算平台出具为准，开票及账单数据在出入、含税及服务费三个模块内。</div>
            </template>
        </el-alert>

        <!-- 操作区 -->
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder">
                <template #option>
                    <el-button type="primary" :loading="dataPage.loadingExport" @click="exportHandler">导出</el-button>
                </template>
                <!-- 列表 -->
                <el-table-column label="所属分支机构" prop="orgName" min-width="120" align="left" />
                <el-table-column label="应用名称" prop="appName" min-width="120" align="left" />
                <el-table-column label="账单月份" prop="billDate" min-width="120" align="left" />
                <el-table-column label="账单编号" prop="billNo" min-width="160" align="left" />

                <el-table-column label="商品金额（元）" prop="goodsAmountTotal" min-width="120" align="right" />
                <el-table-column label="售后商品金额（元）" prop="goodsAmountAfterTotal" min-width="140" align="right" />
                <el-table-column label="开票商品金额（元）" prop="goodsAmountInvoiceTotal" min-width="140" align="right" />

                <el-table-column label="商品运费金额（元）" prop="goodsFreightTotal" min-width="140" align="right" />
                <el-table-column label="售后运费金额（元）" prop="goodsFreightAfterTotal" min-width="140" align="right" />
                <el-table-column label="开票运费金额（元）" prop="goodsFreightInvoiceTotal" min-width="140" align="right" />

                <el-table-column label="商品服务费金额（元）" prop="goodsServiceTotal" min-width="150" align="right" />
                <el-table-column label="售后服务费金额（元）" prop="goodsServiceAfterTotal" min-width="150" align="right" />
                <el-table-column label="开票服务费金额（元）" prop="goodsServiceInvoiceTotal" min-width="150" align="right" />

                <el-table-column label="可开票金额（元）" prop="goodsAmountFinalInvoiceTotal" min-width="140" align="right" />

                <el-table-column label="操作" min-width="100" align="right" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="goDetail(row)">详情</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
    </PageContainer>
</template>

<style lang="scss" scoped>
.option_box {
    margin-top: 8px;
}

.mb12 {
    margin-bottom: 12px;
}
</style>