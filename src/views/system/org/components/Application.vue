<script setup lang="ts">
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ElButton } from 'element-plus'
import application_api from '@/api/system/application'
const props = defineProps({
  curryOrgInfo: {
    type: Object,
    default: {}
  },
  type: {
    type: String,
    default: 'edit'
  }
})
const emits = defineEmits<{
  (e: 'change', val: any): void
  (e: 'update:curryOrgInfo', val: any): void
}>()
const router = useRouter()
const dataPage: IPage<any, any> = reactive({
  isOnload: false,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    appName: '',
    createDateStart: null,
    createDateEnd: null
  },
  facadeKz: {
    orgIdList: null
  },
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
watch(
  () => props.curryOrgInfo,
  () => {
    dataPage.facadeKz.orgIdList = [props.curryOrgInfo.id]
    searchQueryHarder()
  },
  {
    deep: true
  }
)

const exportHandler = () => {
  const obj = getQueryParams()
  toDownloadCenter(obj)
}

const disableHandler = (row: any) => {
  ElMessageBox.confirm(`是否确认禁用？禁用后，该应用将被禁止下单。`, '禁用提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    application_api.A_status({ status: 0, id: row.id }).then(() => {
      ElMessage.success('禁用成功!')
      searchQueryHarder()
    })
  })
}
const enableHandler = (row: any) => {
  ElMessageBox.confirm(`是否确认启用?`, '启用提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    application_api.A_status({ status: 1, id: row.id }).then(() => {
      ElMessage.success('启用成功!')
      searchQueryHarder()
    })
  })
}
</script>
<template>
  <div class="application-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>{{curryOrgInfo?.name}}</h3>
          <span>机构ID: {{curryOrgInfo?.id}}</span>
        </div>
      </template>
      <div>
        <PageContainer class="main_box">
          <SearchForm
            v-model:model="dataPage.facade"
            v-model:current-page="dataPage.page.page"
            class="el-search-item"
            @search="searchQueryHarder"
          >
            <el-form-item label="应用">
              <el-input v-model="dataPage.facade.appName" placeholder="应用编码/应用名称" clearable />
            </el-form-item>
          </SearchForm>
          <div class="option_box">
            <TableModel
              :page="dataPage.page"
              :listTableData="dataPage.dataList"
              @pagingQuery="searchQueryHarder"
              @selection-change="handleSelectionChange"
            >
              <el-table-column prop="orgName" label="分支机构"></el-table-column>
              <el-table-column prop="appName" label="应用名称"></el-table-column>
              <el-table-column prop="appCode" label="应用编码"></el-table-column>
              <el-table-column prop label="上架商品"></el-table-column>
              <el-table-column prop="createDate" label="创建时间"></el-table-column>
              <el-table-column prop="status" label="状态">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '正常' : '禁用' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120px" align="right">
                <template #default="{ row }">
                  <el-button type="primary" v-if="row.status == 1" link @click="disableHandler(row)">禁用</el-button>
                  <el-button type="primary" v-if="row.status != 1" link @click="enableHandler(row)">启用</el-button>
                </template>
              </el-table-column>
            </TableModel>
          </div>
        </PageContainer>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.application-container {
  flex: 1;
  .card-header {
    display: flex;
    gap: 24px;
    align-items: center;
  }
}
</style>