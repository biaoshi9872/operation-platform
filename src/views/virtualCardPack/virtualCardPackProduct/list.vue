<script setup lang="ts">
defineOptions({
    name: 'virtualCardPackProductList'
})
import virtualCardPackProduct_api from '@/api/virtualCardPackProduct'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import virtualCardPackProductEnum from '@/utils/constant/virtualCardPackProduct'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import PushVirtualProductModel from './components/PushVirtualProductModel.vue'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
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
        orgIds: [],
        endDate: ''
    },
    otherData: {
        showRecharge: false,
        curryInfo: {}
    },
    showPushVirtualProductModel: true,
    dataList: [],
    toDownloadCenterApi: virtualCardPackProduct_api.A_supplierExcel,
    selectPage: virtualCardPackProduct_api.A_page,
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
        path: '/virtualCardPack/virtualCardPackProduct/edit',
        query: {
            id: row.id
        }
    })
}

// 查看详情处理函数
const handleView = (row: any) => {
    router.push({
        path: '/virtualCardPack/virtualCardPackProduct/detail',
        query: {
            id: row.id
        }
    })
}
/**
 * 新增
 */
const handleAdd = () => {
    router.push({
        path: '/virtualCardPack/virtualCardPackProduct/index'
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
            <el-form-item v-if="getSystemOptionType == 101" label="所属机构">
                <OrgSelect v-model="dataPage.facade.orgIds" multiple>
                </OrgSelect>
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder">
                <template #option>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                    <el-button type="primary" :loading="dataPage.loadingExport" @click="exportHandler">导出</el-button>
                </template>
                <el-table-column label="提交时间" prop="createDate" min-width="170px" align="left"></el-table-column>
                <el-table-column label="最近更新人" show-overflow-tooltip prop="updateByStr" min-width="120px"
                    align="left"></el-table-column>
                <el-table-column label="操作" min-width="120px" align="right" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" link @click="handleView(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
    </PageContainer>
    <PushVirtualProductModel v-model="dataPage.showPushVirtualProductModel" ref="pushVirtualProductModelRef">
    </PushVirtualProductModel>
</template>
<style lang="scss" scoped></style>