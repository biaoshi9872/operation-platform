<script setup lang="ts">
defineOptions({
  name: 'exportTemplate'
})
import exportTemplate_api from '@/api/exportTemplate/index'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import { downloadExcel } from '@/utils/upload'
import { ElButton } from 'element-plus'
import TemplateModel from './components/TemplateModel.vue'
import TemplateTypeModel from './components/TemplateTypeModel.vue'
const router = useRouter()
type TotherData = {
  show: Boolean
  curryInfo: any
}
const dataPage: IPage<any, any> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {},
  templateTypeList: [],
  dialogVisible: false,
  templateVisible: false,
  curryInfo: {},
  dataList: [],
  selectPage: exportTemplate_api.A_excelTemplatePage
})
const { searchQuery, toDownloadCenter } = pageHooks(dataPage)
const { otherData } = toRefs<{ otherData: TotherData }>(dataPage as any)
const getQueryParams = () => {
  const { page, facade, facadeKz } = dataPage
  return { ...page, ...facade, ...facadeKz }
}
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}

const addTemplate = () => {
  dataPage.dialogVisible = true
  dataPage.curryInfo = {}
}

const addTemplateType = () => {
  dataPage.templateVisible = true
}
onMounted(() => {
  templateTypeList()
})

const templateTypeList = () => {
  exportTemplate.A_templateTypeList().then((res: any) => {
    dataPage.templateTypeList = Object.keys(res).map(el => {
      return {
        desc: res[el],
        value: el
      }
    })
  })
}

const editTemplateHandler = (row: any) => {
  dataPage.dialogVisible = true
  dataPage.curryInfo = row
}

//下载
const downFileHandler = (row: any) => {
  downloadExcel(row.ossUrl, row.fileName)
}

//预览
const viewFile = (row: any) => {
  dataPage.OfficePreViewDialogVisible = true
  dataPage.curryInfo = {
    ossUrl: row.ossUrl,
    fileName: row.fileName
  }
}
</script>
<template>
  <PageContainer class="main_box">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <el-form-item label="文件名">
        <el-input v-model.trim="dataPage.facade.fileName"></el-input>
      </el-form-item>
      <el-form-item label="ossUrl">
        <el-input v-model.trim="dataPage.facade.ossUrl"></el-input>
      </el-form-item>
      <el-form-item label="模板名称">
        <el-select v-model.trim="dataPage.facade.templateType">
          <el-option v-for="(item, index) in dataPage.templateTypeList" :label="item.desc"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </SearchForm>
    <div class="option_box">
      <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" :dataPage="dataPage"
        @pagingQuery="searchQueryHarder">
        <template #option>
          <el-button type="primary" @click="addTemplate">新增模块</el-button>
          <el-button type="primary" @click="addTemplateType">新增模块类型</el-button>
        </template>
        <YbtTableColumn prop="templateType" label="模板类型" width="200"></YbtTableColumn>
        <YbtTableColumn prop="fileName" label="导出文件名"></YbtTableColumn>
        <YbtTableColumn prop="ossUrl" label="ossUrl"></YbtTableColumn>
        <YbtTableColumn prop="createTime" label="创建时间" width="200"></YbtTableColumn>
        <YbtTableColumn prop="updateTime" label="更新时间" width="200"></YbtTableColumn>
        <YbtTableColumn prop label="操作" fixed="right" align="right" width="200">
          <template #default="{ row }">
            <el-button type="text" @click="editTemplateHandler(row)">编辑</el-button>
            <el-button v-if="row.ossUrl" type="text" @click="downFileHandler(row)">下载</el-button>
            <el-button v-if="row.ossUrl" type="text" @click="viewFile(row)">预览</el-button>
          </template>
        </YbtTableColumn>
      </TableModel>
    </div>
    <TemplateModel v-model="dataPage.dialogVisible" :curryInfo="dataPage.curryInfo" @refresh="searchQueryHarder">
    </TemplateModel>
    <TemplateTypeModel v-model="dataPage.templateVisible" :curryInfo="dataPage.curryInfo" @refresh="templateTypeList">
    </TemplateTypeModel>
    <OfficePreview v-model="dataPage.OfficePreViewDialogVisible" :ossFile="dataPage.curryInfo"></OfficePreview>
  </PageContainer>
</template>
<style lang="scss" scoped></style>