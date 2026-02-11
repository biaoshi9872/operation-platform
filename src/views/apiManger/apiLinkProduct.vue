<script setup lang="ts">
defineOptions({
  name: ''
})
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ElButton } from 'element-plus'
import apiLinkProduct from '@/api/apiLinkProduct'
import ycb_enum from '@/utils/constant/apiLinkProduct'
import EditLinkProductModel from './components/EditLinkProductModel.vue'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
const router = useRouter()
const dataPage: IPage<API.T_APIShangPinGuanLianFenYeSearchForm, any> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    appIds: null, //分销
    orgIds: null, //分支机构
    skuCode: '', //驿宝通商品编码
    skuName: '', //驿宝通商品名称
    outSkuName: '', //外部商品名称
    outSkuCode: '', //外部商品编码
    status: '', //
    createTimeStart: '', //创建时间
    createTimeEnd: '',
    updateTimeStart: '', //更新时间
    updateTimeEnd: '', //
    branchName: '',
    branchId: null
  },
  otherData: {
    editProductModel: false,
    curryInfo: {}
  },
  dataList: [],
  toDownloadCenterApi: apiLinkProduct.A_goodExport,
  selectPage: apiLinkProduct.A_page
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
provide('searchQueryHandler', searchQueryHarder)
const handleSelectionChange = (value: any) => {
  dataPage.multipleList = value
}
//导出
const exportHandler = () => {
  const obj = getQueryParams()
  toDownloadCenter(obj)
}

const addOrEditHandler = (row: any, type: 'edit' | 'add') => {
  dataPage.otherData.curryInfo = row
  dataPage.otherData.editProductModel = true
}
</script>
<template>
  <PageContainer class="main_box">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <el-form-item label="应用名称">
        <ApplicationSelect v-model="dataPage.facade.appIds" valueKey="id" :multiple="true"></ApplicationSelect>
      </el-form-item>
      <el-form-item label="分支机构" v-if="['101'].includes(getSystemOptionType)">
        <OrgSelect v-model="dataPage.facade.orgIds" valueKey="id" :multiple="true"></OrgSelect>
      </el-form-item>
      <el-form-item label="驿宝通商品编码">
        <el-input v-model="dataPage.facade.skuCode" placeholder="请输入驿宝通商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="驿宝通商品名称">
        <el-input v-model="dataPage.facade.skuName" placeholder="请输入驿宝通商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="外部商品名称">
        <el-input v-model="dataPage.facade.outSkuName" placeholder="请输入外部商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="外部商品编码">
        <el-input v-model="dataPage.facade.outSkuCode" placeholder="请输入外部商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="分行名称">
        <!-- <el-input v-model="dataPage.facade.branchName" placeholder="请输入分行名称" clearable></el-input> -->
        <BranchSelect v-model:modelName="dataPage.facade.branchName" v-model="dataPage.facade.branchId"
          placeholder="请选择分行名称" filterable clearable :multiple="false"></BranchSelect>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-select v-model="dataPage.facade.goodsStatus" placeholder="请选择" clearable filterable true>
          <el-option label="全部" value></el-option>
          <el-option v-for="item in ycb_enum.E_ShangPinZhuangTai" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新增时间">
        <DatePickerRange v-model:start="dataPage.facade.createDataMin" v-model:end="dataPage.facade.createDataMax" />
      </el-form-item>
      <el-form-item label="更新时间">
        <DatePickerRange v-model:start="dataPage.facade.updateDataMin" v-model:end="dataPage.facade.updateDataMax" />
      </el-form-item>
    </SearchForm>
    <PageTable :page="dataPage.page" :listTableData="dataPage.dataList" id="skuCode" @pagingQuery="searchQueryHarder"
      :loading="dataPage.loadingData" @selection-change="handleSelectionChange">
      <template #option>
        <AuthButton authKey="API_LINK_ADD" type="primary" @click="addOrEditHandler(null, 'add')">新增</AuthButton>
        <AuthButton authKey="API_LINK_EXPORT" type="primary" :loading="dataPage.loadingExport" @click="exportHandler()">
          导出</AuthButton>
      </template>
      <el-table-column label="应用名称" prop="appName" show-overflow-tooltip min-width="150px"
        align="left"></el-table-column>
      <el-table-column label="分支机构" v-if="['101'].includes(getSystemOptionType)" prop="orgName" show-overflow-tooltip
        min-width="150px" align="left"></el-table-column>
      <el-table-column label="驿宝通商品名称" prop="skuName" show-overflow-tooltip min-width="150px"
        align="left"></el-table-column>
      <el-table-column label="外部商品名称" prop="outSkuName" show-overflow-tooltip min-width="150px"
        align="left"></el-table-column>
      <el-table-column label="驿宝通商品编码" prop="skuCode" min-width="175px" align="left"></el-table-column>
      <el-table-column label="外部商品编码" prop="outSkuCode" min-width="175px" align="left"></el-table-column>
      <el-table-column label="商品状态" prop="goodsStatus" min-width="100px" align="left">
        <template #default="{ row }">{{ ycb_enum.getE_ShangPinZhuangTai(row.goodsStatus) }}</template>
      </el-table-column>
      <el-table-column label="分行名称" prop="branchName" show-overflow-tooltip min-width="150px"
        align="left"></el-table-column>
      <el-table-column label="库存数量" prop="stockNum" min-width="80px" align="left"></el-table-column>
      <el-table-column label="新增时间" prop="createDate" min-width="120px" align="left"></el-table-column>
      <el-table-column label="更新时间" prop="updateDate" min-width="120px" align="left"></el-table-column>
      <el-table-column label="操作" min-width="120px" align="right">
        <template #default="{ row }">
          <AuthButton authKey="API_LINK_EDIT" type="text" @click="addOrEditHandler(row, 'edit')">编辑</AuthButton>
        </template>
      </el-table-column>
    </PageTable>
    <EditLinkProductModel v-model="dataPage.otherData.editProductModel" :curryInfo="dataPage.otherData.curryInfo"
      @refresh="searchQueryHarder"></EditLinkProductModel>
  </PageContainer>
</template>
<style lang="scss" scoped></style>
