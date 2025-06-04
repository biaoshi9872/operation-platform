<script setup lang="ts">
defineOptions({
  name: 'applicationList'
})
import application_api from '@/api/system/application'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import pageHooks from '@/hooks/pageListHooks'
import { useUserStore } from '@/stores'
import { IPage } from '@/types/from-types'
import { encrypted, strEncodeURIComponent } from '@/utils/encrypt'
import { ElButton } from 'element-plus'
import ApplicationModel from './components/ApplicationModel.vue'
const { isOrgLast } = isStateCheckHooks()
const $useUserStore = useUserStore()
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
const { searchQuery } = pageHooks(dataPage)
const getQueryParams = () => {
  const { page, facade, facadeKz } = dataPage
  return { ...page, ...facade, ...facadeKz }
}
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}
provide('searchQueryHandler', searchQueryHarder)

const addApplicationHandler = () => {
  dataPage.curryInfo = null
  dataPage.showApplication = true
}
const editApplicationHandler = (row: any) => {
  dataPage.curryInfo = row
  dataPage.showApplication = true
}

const toApplicationHandler = (row: any) => {
  let appId = row.id
  let projectStr = encrypted(JSON.stringify({ appId }))
  let enPro = strEncodeURIComponent(projectStr)
  let url = window.location.origin
  let path = `${url}/api_application/goodsManger/goodsPoor/index?projectId=${enPro}`
  window.open(path, '_blank')
}
</script>
<template>
  <PageContainer class="app_box">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <template #tabs>
        <div class="tip-container">
          海量商品全品类覆盖 品质服务全程保障
          <br />整合京东、京东生鲜等头部电商平台资源，联合全国知名品牌厂商直供，构建包含实物商品与虚拟权益的多维供应链体系，为您提供一站式采购解决方案：
          <br />• 全品类实物供应：覆盖百万级SKU，支持企业定制化采购
          <br />• 虚拟权益全覆盖：含加油卡、通讯充值、影视会员（腾讯/爱奇艺等）、本地生活（饿了么/星巴克/猫眼电影）等千余种数字商品
        </div>
      </template>
      <el-form-item v-if="!isOrgLast" label="分支机构">
        <OrgSelect v-model="dataPage.facade.orgIdList" :multiple="true"></OrgSelect>
      </el-form-item>
      <el-form-item label="应用名称">
        <el-input v-model="dataPage.facade.appName" placeholder="请输入应用名称"></el-input>
      </el-form-item>
    </SearchForm>
    <div class="option_box">
      <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder">
        <template #option>
          <AuthButton authKey="APP_ADD" type="primary" @click="addApplicationHandler">创建应用</AuthButton>
        </template>
        <el-table-column prop="appName" label="应用名称">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <img style="width: 30px; height:30px" src="@/assets/images/app.png" />
              <OverflowTooltipCell :text="row.appName">{{ row.appName }}</OverflowTooltipCell>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="分支机构"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="createDate" label="创建人"></el-table-column>
        <el-table-column label="操作" width="200px" align="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="toApplicationHandler(row)">应用管理</el-button>
            <AuthButton authKey="APP_EDIT" type="primary" link @click="editApplicationHandler(row)">编辑</AuthButton>
          </template>
        </el-table-column>
      </TableModel>
    </div>
    <ApplicationModel v-model="dataPage.showApplication" :curryInfo="dataPage.curryInfo"></ApplicationModel>
  </PageContainer>
</template>
<style lang="scss" scoped>
.app_box {
  ::v-deep(.search-container) {
    padding-top: 10px !important;
  }
}

.tip-container {
  padding: 12px 16px;
  background: #f1eded99;
  color: #999;
}
</style>