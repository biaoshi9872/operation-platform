<script setup lang="ts">
defineOptions({
    name: 'supplierInfoList'
})
import supplier_api from '@/api/supplier'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import supplierEnum from '@/utils/constant/supplier'
const router = useRouter()
type TotherData = {
    showRecharge: Boolean
    curryInfo: API.T_GongYingShangZiLiaoFenYeLieBiaoListRecords
}
const dataPage: IPage<any, any> = reactive({
    isOnload: true,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {
        supplyName: '',
        startDate: '',
        endDate: ''
    },
    otherData: {
        showRecharge: false,
        curryInfo: {}
    },
    dataList: [],
    toDownloadCenterApi: supplier_api.A_supplierExcel,
    selectPage: supplier_api.A_page,
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

// 编辑处理函数
const handleEdit = (row: any) => {
    router.push({
        path: '/supplierManagement/supplierInfo/index',
        query: {
            id: row.id,
            type: 'edit'
        }
    })
}

// 查看详情处理函数
const handleView = (row: any) => {
    router.push({
        path: '/supplierManagement/supplierInfo/index',
        query: {
            id: row.id,
            type: 'detail'
        }
    })
}
/**
 * 新增
 */
const handleAdd = () => {
    router.push({
        path: '/supplierManagement/supplierInfo/index',
        query: {
            type: 'edit'
        }
    })
}

/**
 * 导出
 */
const exportHandler = () => {
    const obj = getQueryParams()
    toDownloadCenter(obj)
}

</script>
<template>
    <PageContainer class="main_box">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="新增时间">
                <DatePickerRange v-model:start="dataPage.facade.startDate" v-model:end="dataPage.facade.endDate">
                </DatePickerRange>
            </el-form-item>
            <el-form-item label="供应商名称">
                <el-input v-model="dataPage.facade.supplyName" placeholder="请输入供应商名称" clearable />
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder">
                <template #option>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                    <el-button type="primary" :loading="dataPage.loadingExport" @click="exportHandler">导出</el-button>
                </template>
                <el-table-column label="提交时间" prop="createDate" min-width="120px" align="left"></el-table-column>
                <el-table-column label="提交人" prop="createByStr" min-width="120px" align="left"></el-table-column>
                <el-table-column label="供应商名称" prop="companyName" min-width="120px" align="left"
                    show-overflow-tooltip></el-table-column>
                <el-table-column label="联系人" prop="contractName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="联系电话" prop="contractTel" min-width="120px" align="left"></el-table-column>
                <el-table-column label="合作时间" prop="cooperationStartDate" width="200px" align="left">
                    <template #default="{ row }">
                        {{ row.cooperationStartDate }} 至 {{ row.cooperationEndDate }}
                    </template>
                </el-table-column>
                <el-table-column label="经营范围" prop="businessScope" min-width="120px" align="left">
                    <template #default="{ row }">
                        {{ supplierEnum.getBusinessScope(row.businessScope) }}
                    </template>
                </el-table-column>
                <el-table-column label="最近更新时间" prop="updateDate" min-width="120px" align="left"></el-table-column>
                <el-table-column label="最近更新人" prop="updateByStr" min-width="120px" align="left"></el-table-column>
                <el-table-column label="操作" min-width="120px" align="left">
                    <template #default="scope">
                        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" link @click="handleView(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
    </PageContainer>
</template>
<style lang="scss" scoped></style>