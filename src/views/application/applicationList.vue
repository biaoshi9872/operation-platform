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
import { setLocal } from '@/utils/storage'
import { ElButton } from 'element-plus'
import AppCell from './components/AppCell.vue'
import ApplicationModel from './components/ApplicationModel.vue'
import system_enum from '@/utils/constant/system'
const { isOrgLast } = isStateCheckHooks()
const $useUserStore = useUserStore()
const router = useRouter()
const dataPage: IPage<any, any> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 12,
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
  toDownloadCenterApi: undefined,
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
const getProjectId = (row: any) => {
  let appId = row.id
  let projectStr = encrypted(JSON.stringify({ appId }))
  let enPro = strEncodeURIComponent(projectStr)
  try {
    navigator.clipboard.writeText(enPro);
  } catch (error) {
    console.log(error)
  }
  return enPro
}
const toApplicationHandler = (row: any) => {
  const enPro = getProjectId(row)
  setLocal('projectId', enPro)
  let url = window.location.origin
  debugger
  if (url.indexOf('localhost') > -1) {
    let path = `http://localhost:7071/api_application/goodsManger/goodsPoor/index?projectId=${enPro}`
    window.open(path, '_blank')
  } else {
    let path = `${url}/api_application/goodsManger/goodsPoor/index?projectId=${enPro}`
    window.open(path, '_blank')
  }
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
      <el-form-item label="项目类型" class="formItem" placeholder="请选择">
        <SelectModel v-model.trim="dataPage.facade.projectTypeList" :selectList="system_enum.projectType">
        </SelectModel>
      </el-form-item>
      <template #button>
        <AuthButton authKey="APP_ADD" type="primary" @click="addApplicationHandler">创建应用</AuthButton>
      </template>
    </SearchForm>
    <div class="bg-#fff p-8 app-list-container">
      <div class="app-grid">
        <AppCell v-for="item in dataPage.dataList" :key="item.id" :row="item" @manage="toApplicationHandler"
          @edit="editApplicationHandler" @copyId="getProjectId"></AppCell>
      </div>
      <div class="app-pagination-container">
        <CustomPagination @pagingQuery="searchQueryHarder" :page="dataPage.page" :page-sizes="[12, 24, 36, 48]">
        </CustomPagination>
      </div>
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

.app-list-container {
  flex: 1;
  overflow: auto;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
  /* gap-6 */
  margin-top: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>