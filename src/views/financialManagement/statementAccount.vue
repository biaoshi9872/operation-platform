<script setup lang="ts">
defineOptions({
    name: 'StatementAccount'
})
import { reactive } from 'vue'
import pageHooks from '@/hooks/pageListHooks'
import moneyManagement_api from '@/api/moneyManagement'
import { tabsStore } from '@/stores'
const router = useRouter()
const tabsStoreInfo: any = tabsStore()
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
        billNo: '',
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
    tabsStoreInfo.reload({
        path: '/financialManagement/statementAccountDetal',
        query: {
            billNo: String(row.billNo || ''),
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
            <el-form-item label="机构名称">
                <OrgSelect v-model="dataPage.facade.orgId" />
            </el-form-item>
            <el-form-item label="应用名称">
                <ApplicationSelect v-model="dataPage.facade.appId" :multiple="false" valueKey="id"
                    valueLabel="appName" />
            </el-form-item>
            <el-form-item label="账单编号">
                <el-input v-model.trim="dataPage.facade.billNo" placeholder="请输入账单编号" clearable />
            </el-form-item>
        </SearchForm>
        <div class="bg-white p-12 mb12 border-radius-8">
            <div class="tip-container">
                <div><svg-icon name="menu-order" class="fs-22" /> 账单说明：</div>
                <div>1、账单以月的维度展示，每天凌晨更新T+3的订单数据，已确认的订单（下单成功）为正流水，售后已完成的订单将会出负流水记录（换货除外）。</div>
                <div>2、每个应用一个账单。</div>
                <div>3、账单数据仅供参考，具体的出账及开票请在综管平台进行，若双方账单数据存在出入，请及时核查并反馈处理。</div>
            </div>
        </div>
        <!-- 说明文案（根据截图补充） -->
        <!-- 操作区 -->
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder">
                <template #option>
                    <el-button type="primary" :loading="dataPage.loadingExport" @click="exportHandler">导出</el-button>
                </template>
                <!-- 列表 -->
                <el-table-column label="所属分支机构" prop="orgName" min-width="180" show-overflow-tooltip align="left" />
                <el-table-column label="应用名称" prop="appName" min-width="120" show-overflow-tooltip align="left" />
                <el-table-column label="账单月份" prop="billDate" min-width="120" align="left" />
                <el-table-column label="账单编号" prop="billNo" min-width="160" align="left" />
                <el-table-column label="商品金额（元）" prop="goodsAmountTotal" min-width="160" align="left" />
                <el-table-column label="售后商品金额（元）" prop="goodsAmountAfterTotal" min-width="180" align="left" />
                <el-table-column label="开票商品金额（元）" prop="goodsAmountInvoiceTotal" min-width="180" align="left" />
                <el-table-column label="商品运费金额（元）" prop="goodsFreightTotal" min-width="180" align="left" />
                <el-table-column label="售后运费金额（元）" prop="goodsFreightAfterTotal" min-width="180" align="left" />
                <el-table-column label="开票运费金额（元）" prop="goodsFreightInvoiceTotal" min-width="180" align="left" />
                <el-table-column label="商品服务费金额（元）" prop="goodsServiceTotal" min-width="180" align="left" />
                <el-table-column label="售后服务费金额（元）" prop="goodsServiceAfterTotal" min-width="180" align="left" />
                <el-table-column label="开票服务费金额（元）" prop="goodsServiceInvoiceTotal" min-width="180" align="left" />
                <el-table-column label="可开票金额（元）" prop="goodsAmountFinalInvoiceTotal" min-width="160" align="left" />
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

.tip-container {
    padding: 12px;
    background: rgba(241, 237, 237, 0.6);
    color: #999;
    line-height: 25px;
}

.mb12 {
    margin-bottom: 12px;
}
</style>