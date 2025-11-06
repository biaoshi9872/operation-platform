<script setup lang="ts">
defineOptions({
    name: 'intentionCompanyList'
})
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import apiFiles from '@/api/apiFiles'

const router = useRouter()
const dataPage: IPage<any, any> = reactive({
    isOnload: true,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {
        companyName: '',
        createTimeStart: '',
        createTimeEnd: ''
    },
    otherData: {
        showRecharge: false,
        curryInfo: {}
    },
    dataList: [],
    selectPage: apiFiles.A_intentionCompanyList,
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
const handleSelectionChange = (value: any) => {
    dataPage.multipleList = value
}

</script>
<template>
    <PageContainer class="main_box">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="提交时间">
                <DatePickerRange v-model:start="dataPage.facade.createTimeStart"
                    v-model:end="dataPage.facade.createTimeEnd">
                </DatePickerRange>
            </el-form-item>
            <el-form-item label="公司名称">
                <el-input placeholder="请输入公司名称" v-model="dataPage.facade.companyName"></el-input>
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder"
                @selection-change="handleSelectionChange">
                <el-table-column prop="createTime" label="提交时间"></el-table-column>
                <el-table-column prop="personName" label="联系人"></el-table-column>
                <el-table-column prop="phone" label="联系方式"></el-table-column>
                <el-table-column prop="companyName" label="企业名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="content" label="咨询内容" show-overflow-tooltip></el-table-column>
            </TableModel>
        </div>
    </PageContainer>
</template>
<style lang="scss" scoped></style>