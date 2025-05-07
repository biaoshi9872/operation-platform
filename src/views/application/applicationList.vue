<script setup lang="ts">
defineOptions({
  name: 'applicationList'
})
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ElButton } from 'element-plus'
import ApplicationModel from './components/ApplicationModel.vue'
import application_api from '@/api/system/application'

const router = useRouter()
const dataPage: IPage<any, any> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    orgIdList: null,
    appName: '',
    createDateStart: null,
    createDateEnd: null
  },
  facadeKz: {},
  showApplication: false,
  curryInfo: {},
  dataList: [],
  toDownloadCenterApi: null,
  selectPage: application_api.A_page
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
provide('searchQueryHandler', searchQueryHarder)
const handleSelectionChange = (value: any) => {
  dataPage.multipleList = value
}
const exportHandler = () => {
  const obj = getQueryParams()
  toDownloadCenter(obj)
}

const addApplicationHandler = () => {
  dataPage.curryInfo = null
  dataPage.showApplication = true
}
const editApplicationHandler = (row: any) => {
  dataPage.curryInfo = row
  dataPage.showApplication = true
}
</script>
<template>
  <PageContainer class="main_box">
    <SearchForm
      v-model:model="dataPage.facade"
      v-model:current-page="dataPage.page.page"
      class="el-search-item"
      @search="searchQueryHarder"
    >
      <el-form-item label="创建时间">
        <DatePickerRange v-model:start="dataPage.facade.createDateStart" v-model:end="dataPage.facade.createDateEnd"></DatePickerRange>
      </el-form-item>
      <el-form-item label="分支机构">
        <OrgSelect v-model="dataPage.facade.orgIdList" :multiple="true"></OrgSelect>
      </el-form-item>
    </SearchForm>
    <div class="option_box">
      <TableModel
        :page="dataPage.page"
        :listTableData="dataPage.dataList"
        @pagingQuery="searchQueryHarder"
        @selection-change="handleSelectionChange"
      >
        <template #option>
          <el-button type="primary">导出</el-button>
          <el-button type="primary" @click="addApplicationHandler">创建应用</el-button>
        </template>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="orgName" label="分支机构"></el-table-column>
        <el-table-column prop="appName" label="应用名称"></el-table-column>
        <el-table-column prop="developerEmail" label="开发者邮箱"></el-table-column>
        <el-table-column prop="developerPhone" label="开发者手机"></el-table-column>
        <el-table-column label="操作" width="120px" align="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editApplicationHandler(row)">编辑</el-button>
          </template>
        </el-table-column>
      </TableModel>
    </div>
    <ApplicationModel v-model="dataPage.showApplication" :curryInfo="dataPage.curryInfo"></ApplicationModel>
  </PageContainer>
</template>
<style lang="scss" scoped></style>