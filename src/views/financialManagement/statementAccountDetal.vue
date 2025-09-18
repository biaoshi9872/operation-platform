<script setup lang="ts">
defineOptions({ name: 'StatementAccountDetail' })
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pageHooks from '@/hooks/pageListHooks'
import moneyManagement_api from '@/api/moneyManagement'
import { IPage } from '@/types/from-types'
import goodPoor from '@/utils/constant/goodPoor'
import order_enum from '@/utils/constant/order'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
// 路由参数
const route = useRoute()
const router = useRouter()
const querybillNo = computed(() => String(route.query.billNo || ''))

// 列表页数据模型
const dataPage = reactive<IPage<API.OpenBillDetailParams, API.OpenBillDetailRecord>>({
    isOnload: false,
    // 查询方法
    selectPage: moneyManagement_api.A_openBillDetail,
    // 下载中心导出方法
    toDownloadCenterApi: moneyManagement_api.A_openExportBillDetail,
    // 分页
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    // 查询条件
    facade: {
        billNo: querybillNo.value,      // 必传
        orderNo: '',
        channelOrderNo: '',
        outOrderNo: '',
        skuName: '',
        goodsType: null,
        submitTimeStart: '',
        submitTimeEnd: '',
        confirmTimeStart: '',
        confirmTimeEnd: '',
        statementType: null
    },
    facadeKz: {},
    dataList: []
})

const { searchQuery, toDownloadCenter, pagingQuery } = pageHooks(dataPage)

onMounted(() => {
    searchQueryHarder()
})
const getQueryParams = () => {
    const { page, facade, facadeKz } = dataPage
    return { ...page, ...facade, ...facadeKz }
}

const searchQueryHarder = () => {
    const obj = getQueryParams()
    searchQuery(obj)
}

const pagingQueryHarder = () => {
    const obj = getQueryParams()
    pagingQuery(obj)
}

const exportHandler = () => {
    // 该导出接口只需要 billNo（注意大写 O），附带分页参数
    toDownloadCenter({
        billNo: dataPage.facade.billNo || querybillNo.value,
        page: dataPage.page.page,
        limit: dataPage.page.limit
    })
}

</script>

<template>
    <PageContainer class="main_box">
        <!-- 搜索区 -->
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="提交订单时间" class="el-form-item-inputGroup">
                <DatePickerRange v-model:start="dataPage.facade.submitTimeStart"
                    v-model:end="dataPage.facade.submitTimeEnd" />
            </el-form-item>
            <el-form-item label="确认下单时间" class="el-form-item-inputGroup">
                <DatePickerRange v-model:start="dataPage.facade.confirmTimeStart"
                    v-model:end="dataPage.facade.confirmTimeEnd" />
            </el-form-item>
            <el-form-item label="订单编号">
                <el-input v-model.trim="dataPage.facade.orderNo" placeholder="请输入订单编号" clearable />
            </el-form-item>
            <el-form-item label="供应商订单编号">
                <el-input v-model.trim="dataPage.facade.channelOrderNo" placeholder="请输入供应商订单编号" clearable />
            </el-form-item>
            <el-form-item label="第三方订单编号">
                <el-input v-model.trim="dataPage.facade.outOrderNo" placeholder="请输入第三方订单编号" clearable />
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input v-model.trim="dataPage.facade.skuName" placeholder="请输入商品名称" clearable />
            </el-form-item>
            <el-form-item label="商品类型">
                <SelectModel v-model.trim="dataPage.facade.goodsType" :selectList="goodPoor.sourceTypeList" />
            </el-form-item>
            <el-form-item label="是否售后完成">
                <el-select v-model="dataPage.facade.statementType" clearable>
                    <el-option label="全部" value></el-option>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                </el-select>
            </el-form-item>
        </SearchForm>
        <!-- 操作区 + 表格 -->
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="pagingQueryHarder">
                <template #option>
                    <el-button type="primary" :loading="dataPage.loadingExport" @click="exportHandler">导出</el-button>
                </template>
                <!-- 列定义 -->
                <el-table-column label="订单编号" prop="orderNo" min-width="200" align="left" />
                <el-table-column label="供应商订单编号" prop="channelOrderNo" min-width="200" align="left" />
                <el-table-column label="第三方订单编号" prop="outOrderNo" min-width="200" align="left" />
                <el-table-column label="提交订单时间" prop="submitTime" min-width="170" align="left" />
                <el-table-column label="确认订单时间" prop="confirmTime" min-width="160" align="left" />
                <el-table-column label="订单状态" prop="orderStatus" min-width="100" align="center">
                    <template #default="scope">
                        {{ order_enum.getOrder_statesTitle(scope.row.orderStatus) }}
                    </template>
                </el-table-column>
                <el-table-column label="是否售后完成" prop="statementType" min-width="100" align="center">
                    <template #default="scope">
                        {{ scope.row.statementType === 1 ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column label="售后类型" prop="afterOrderType" min-width="100" align="center">
                    <template #default="scope">
                        {{ order_enum.getAfterSalesTypeTitle(scope.row.afterOrderType) }}
                    </template>
                </el-table-column>
                <el-table-column label="商品编码" prop="skuCode" min-width="140" align="left" />
                <el-table-column label="商品名称" prop="skuName" show-overflow-tooltip min-width="200" align="left" />
                <el-table-column label="商品数量" prop="goodsNum" min-width="100" align="left" />
                <el-table-column label="商品单价" prop="retailPrice" min-width="120" align="left" />
                <el-table-column label="商品总金额" prop="goodsPriceTotal" min-width="140" align="left" />
                <el-table-column label="运费（元）" prop="freightAmount" min-width="120" align="left" />
                <el-table-column label="服务费（元）" prop="serviceAmount" min-width="120" align="left" />
                <el-table-column label="结算总金额（元）" prop="settlementPriceTotal" min-width="160" align="left" />
                <el-table-column label="商品类型" prop="goodsTypeName" min-width="120" align="center">
                    <template #default="scope">
                        {{ scope.row.goodsTypeName }}
                    </template>
                </el-table-column>
                <el-table-column v-if="(['101'].includes(getSystemOptionType))" label="供应商" show-overflow-tooltip
                    prop="supplyName" min-width="160" align="left" />
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