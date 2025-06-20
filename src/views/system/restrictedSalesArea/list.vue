<script setup lang="ts">
defineOptions({
    name: ''
})
import restrictedSalesArea_api from '@/api/restrictedSalesArea'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()

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
    },
    curryInfo: null,
    dataList: [],
    showResetPassword: false,
    showSupplier: false,
    selectPage: restrictedSalesArea_api.A_page,
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


const handleAdd = () => {
    router.push({
        path: '/system/restrictedSalesArea/index',
        query: {
            type: 'edit'
        }
    })
}

const deleteHandler = (row: any) => {
    ElMessageBox.confirm(
        `是否删除改模版?`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            restrictedSalesArea_api.A_delTemplate(row.id).then(() => {
                ElMessage.success('删除成功')
                searchQueryHarder()
            })
        })
}

const viewHandler = (row: any) => {
    router.push({
        path: '/system/restrictedSalesArea/index',
        query: {
            type: 'view',
            id: row.limitTemplateId
        }
    })
}

</script>
<template>
    <PageContainer class="main_box">
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder">
                <template #option>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </template>
                <el-table-column label="序号" type="index" min-width="80px" align="left"></el-table-column>
                <el-table-column label="添加时间" prop="createDate" min-width="80px" align="left"></el-table-column>
                <el-table-column label="模板名称" prop="limitTemplateName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="操作" prop="accountValidStart" min-width="120px" align="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="deleteHandler(row)">删除</el-button>
                        <el-button type="primary" link @click="viewHandler(row)">详情</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
    </PageContainer>
</template>
<style lang="scss" scoped></style>