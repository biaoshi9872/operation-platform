<script setup lang="ts">
defineOptions({
    name: ''
})
import supplier_api from '@/api/supplier'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'


const router = useRouter()
type TotherData = {
    showRecharge: Boolean
    curryInfo: API.T_ZiYouGongYingShangZhangHaoLieBiaoListRecords
}
const dataPage: IPage<any, any> = reactive({
    isOnload: true,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {


    },
    facadeKz: {
        active: '1'
    },
    otherData: {
        showRecharge: false,
        curryInfo: {}
    },
    dataList: [],
    selectPage: supplier_api.A_list,
})
const { searchQuery, toDownloadCenter, downloadFile } = pageHooks(dataPage)

const getQueryParams = () => {
    const { page, facade, facadeKz } = dataPage
    return { ...page, ...facade, ...facadeKz }
}
const searchQueryHarder = () => {
    const obj = getQueryParams()
    searchQuery(obj)
}


</script>
<template>
    <PageContainer class="main_box">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder"></SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder">
                <el-table-column label="" prop="userId" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="accountCode" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="orgId" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="orgName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="supplyName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="contractName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="contractTel" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="businessScope" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="accountValidStart" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="accountValidEnd" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="createTime" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="username" min-width="120px" align="left"></el-table-column>
                <el-table-column label="" prop="status" min-width="120px" align="left"></el-table-column>
            </TableModel>
        </div>
    </PageContainer>
</template>
<style lang="scss" scoped></style>