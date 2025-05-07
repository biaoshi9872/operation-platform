<script setup lang="ts">
defineOptions({ name: 'downloadCenter' })
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import DownloadRecord from './components/downloadRecord.vue'
import { ElMessage } from 'element-plus'
import { A_downloadListApi, A_downloadCountApi } from '@/api/downloadCenter'

//@ts-ignore
const dataPage: IPage<any, any> = reactive({
  selectPage: A_downloadListApi,
  dataList: [],
  page: {
    page: 1,
    limit: 10,
    total: 0
  },
  isOnload: true,
  facade: {
    startDate: '',
    endDate: '',
    fileName: '',
    operStatus: []
  },
  addVisible: false,
  currentData: {},
  disabled: false
})

const { handleSelectionChange, pagingQuery, searchQuery } = pageHooks(dataPage)

// 查询回调
const getQueryParams = () => {
  const { page, facade } = dataPage
  return { ...page, ...facade }
}

// 查询回调
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}

// 分页回调
const pagingQueryHarder = () => {
  const obj = getQueryParams()
  pagingQuery(obj)
}

const clickEditDetail = (row: any, optionState: string) => {
  switch (optionState) {
    case 'download':
      if (dataPage.disabled) return
      dataPage.disabled = true
      A_downloadCountApi({
        id: row.id
      })
        .then((res: any) => {
          if (res.code === 0) {
            window.open(row.url)
          } else {
            ElMessage.error(res.msg)
          }
          searchQueryHarder()
          dataPage.disabled = false
        })
        .catch(() => {
          dataPage.disabled = false
        })
      break

    case 'record':
      dataPage.addVisible = true
      dataPage.currentData = row
      break
  }
}

const DOWNBUTTON_STATE_LIST = [
  { label: '处理中', value: '0' },
  { label: '已处理', value: '1' },
  { label: '已失败', value: '2' }
]

const DOWN_STATE_LIST = [
  { label: '已下载', value: '1' },
  { label: '未下载', value: '0' }
]
</script>
<template>
  <PageContainer class="home">
    <SearchForm
      v-model:model="dataPage.facade"
      v-model:current-page="dataPage.page.page"
      class="el-search-item"
      @search="searchQueryHarder"
    >
      <el-form-item label="文件名" class="el-form-item-inputGroup">
        <el-input v-model.trim="dataPage.facade.fileName" placeholder="请输入文件名"></el-input>
      </el-form-item>
      <el-form-item label="处理状态" class="el-form-item-inputGroup">
        <el-select v-model.trim="dataPage.facade.operStatus" multiple clearable collapse-tags>
          <el-option v-for="(item, index) in DOWNBUTTON_STATE_LIST  " :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求时间" class="el-form-item-inputGroup">
        <DatePickerRange v-model:start="dataPage.facade.startDate" v-model:end="dataPage.facade.endDate"></DatePickerRange>
      </el-form-item>
    </SearchForm>
    <TableModel
      :page="dataPage.page"
      :listTableData="dataPage.dataList"
      :dataPage="dataPage"
      @pagingQuery="pagingQueryHarder"
      @selection-change="handleSelectionChange"
    >
      <YbtTableColumn prop="id" label="文件ID" align="left"></YbtTableColumn>
      <YbtTableColumn prop="fileName" label="文件名" width="200"></YbtTableColumn>
      <YbtTableColumn prop="recordCount" label="数据量"></YbtTableColumn>
      <YbtTableColumn prop="username" label="请求用户"></YbtTableColumn>
      <YbtTableColumn prop="createTime" label="请求时间" width="180"></YbtTableColumn>
      <YbtTableColumn prop="operStatus" label="处理状态">
        <template #default="{ row }">{{ DOWNBUTTON_STATE_LIST.find((el) => el.value == row.operStatus)?.label || '--' }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop="downStatus" label="下载状态">
        <template #default="{ row }">{{ DOWN_STATE_LIST.find((el) => el.value == row.downStatus)?.label || '--' }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop="downStatus" label="是否失效">
        <template #default="{ row }">{{ new Date(Date.parse(row.avalidEndDate.replace('-', '/'))) < new Date() ? '已失效' : "未失效" }}</template>
      </YbtTableColumn>
      <YbtTableColumn prop="downLoadDate" label="下载时间"></YbtTableColumn>
      <YbtTableColumn label="操作" align="right" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="[1].includes(row.operStatus) && !(new Date(Date.parse(row.avalidEndDate.replace('-', '/'))) < new Date())"
            type="text"
            @click="clickEditDetail(row, 'download')"
          >下载</el-button>
          <el-button type="text" @click="clickEditDetail(row, 'record')">下载记录</el-button>
        </template>
      </YbtTableColumn>
    </TableModel>
    <DownloadRecord v-if="dataPage.addVisible" v-model="dataPage.addVisible" :id="dataPage.currentData.id"></DownloadRecord>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
