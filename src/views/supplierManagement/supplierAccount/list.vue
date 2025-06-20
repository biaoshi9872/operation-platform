<script setup lang="ts">
defineOptions({
    name: ''
})
import supplier_api from '@/api/supplier'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import supplierEnum from '@/utils/constant/supplier'
import { ElMessage, ElMessageBox } from 'element-plus'
import ResetPassword from './components/ResetPassword.vue'
import SupplierEditModel from './components/SupplierEditModel.vue'
const router = useRouter()

const dataPage: IPage<any, any> = reactive({
    isOnload: true,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {
        accountCode: '',
        startDate: '',
        endDate: '',
        supplyName: '',
        orgId: '',
        status: ''
    },
    facadeKz: {
        active: '1'
    },
    curryInfo: null,
    dataList: [],
    showResetPassword: false,
    showSupplier: false,
    toDownloadCenterApi: supplier_api.A_supplierAccountExcel,
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

const exportHandler = () => {
    const obj = getQueryParams()
    toDownloadCenter(obj)
}

const handleAdd = () => {
    dataPage.curryInfo = null
    dataPage.showSupplier = true
}
const editAccountHandler = (row: any) => {
    dataPage.curryInfo = row
    dataPage.showSupplier = true
}

const updataStateHandler = (row: any) => {
    const title = row.status == 0 ? '禁用' : '启用'
    const enableEnum = row.status == 0 ? 1 : 0
    ElMessageBox.confirm(
        `是否${title}?`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            supplier_api.A_updateStatus({
                userId: row.userId,
                enableEnum
            }).then(() => {
                ElMessage.success(`${title}成功`)
                searchQueryHarder()
            })
        })
}

const updataPwdHandler = (row: any) => {
    dataPage.curryInfo = row
    dataPage.showResetPassword = true
}

</script>
<template>
    <PageContainer class="main_box">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="编号">
                <el-input v-model="dataPage.facade.accountCode" placeholder="请输入编号" clearable />
            </el-form-item>
            <el-form-item label="账号有效期">
                <DatePickerRange v-model:start="dataPage.facade.startDate" v-model:end="dataPage.facade.endDate">
                </DatePickerRange>
            </el-form-item>
            <el-form-item label="供应商">
                <el-input v-model="dataPage.facade.supplyName" placeholder="请输入供应商名称" clearable />
            </el-form-item>
            <el-form-item label="账号状态">
                <SelectModel v-model="dataPage.facade.status" :selectList="supplierEnum.accountStatus">
                </SelectModel>
            </el-form-item>
            <el-form-item label="所属分支机构">
                <OrgSelect v-model="dataPage.facade.orgId"></OrgSelect>
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder">
                <template #option>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                    <el-button type="primary" :loading="dataPage.loadingExport" @click="exportHandler">导出</el-button>
                </template>
                <el-table-column label="编号" prop="accountCode" min-width="120px" align="left"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" min-width="120px" align="left"></el-table-column>
                <el-table-column label="所属分支机构" prop="orgName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="供应商名称" prop="supplyName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="联系人" prop="contractName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="联系电话" prop="contractTel" min-width="120px" align="left"></el-table-column>
                <el-table-column label="登录账号" prop="username" min-width="120px" align="left"></el-table-column>、
                <el-table-column label="账号状态" prop="status" min-width="120px" align="left">
                    <template #default="{ row }">
                        {{ supplierEnum.getAccountStatus(row.status) }}
                    </template>
                </el-table-column>
                <el-table-column label="账号有效期" prop="status" min-width="120px" align="left">
                    <template #default="{ row }">
                        {{ row.accountValidStart }} 至 {{ row.accountValidEnd }}
                    </template>
                </el-table-column>
                <el-table-column label="经营范围" prop="businessScope" min-width="120px" align="left">
                    <template #default="{ row }">
                        {{ supplierEnum.getBusinessScope(row.businessScope) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="accountValidStart" min-width="140px" align="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="editAccountHandler(row)">编辑</el-button>
                        <el-button v-if="row.status == 1" type="primary" link
                            @click="updataStateHandler(row)">禁用</el-button>
                        <el-button v-if="row.status != 1" type="primary" link
                            @click="updataStateHandler(row)">启用</el-button>
                        <el-button type="primary" link @click="updataPwdHandler(row)">重置密码</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
        <SupplierEditModel v-model="dataPage.showSupplier" :curryInfo="dataPage.curryInfo" @refresh="searchQueryHarder">
        </SupplierEditModel>
        <!-- 修改密码 -->
        <ResetPassword :userId="dataPage?.curryInfo?.userId" v-model="dataPage.showResetPassword" />
    </PageContainer>
</template>
<style lang="scss" scoped></style>