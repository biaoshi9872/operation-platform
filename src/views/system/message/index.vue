<script setup lang="ts">
defineOptions({
  name: 'message'
})
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ElButton } from 'element-plus'
import messageApi from '@/api/message'
const dataPage: IPage<any, any> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    topic: '',
    createTimeStart: '',
    createTimeEnd: '',
    deleteFlag: '',
    deleteTimeStart: '',
    deleteTimeEnd: '',
    businessId: '',
    appCode: ''
  },
  topicList: [],
  topic: {},
  dataList: [],
  selectPage: messageApi.A_getList
})
const { searchQuery } = pageHooks(dataPage)
const getQueryParams = () => {
  const { page, facade } = dataPage
  return { ...page, ...facade }
}
const searchQueryHarder = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}

onMounted(() => {
  messageApi.A_topicList().then((res: any) => {
    dataPage.topic = res
    dataPage.topicList = Object.keys(res).map((el: any) => {
      return { id: el, name: res[el] }
    })
  })
})

const jsonValue = computed(() => {
  return function (val: any) {
    try {
      let obj = JSON.parse(val)
      return obj
    } catch (e) {
      // 转换出错，抛出异常
      return val
    }
  }
})
</script>
<template>
  <PageContainer class="main_box">
    <SearchForm
      v-model:model="dataPage.facade"
      v-model:current-page="dataPage.page.page"
      class="el-search-item"
      @search="searchQueryHarder"
    >
      <el-form-item label="主题">
        <el-select v-model.trim="dataPage.facade.topic">
          <el-option v-for="(item, index) in dataPage.topicList" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <DatePickerRange
          v-model:start="dataPage.facade.createDateStart"
          dateRangeType="daterange"
          v-model:end="dataPage.facade.createDateEnd"
        ></DatePickerRange>
      </el-form-item>
      <el-form-item label="是否消费">
        <el-select v-model.trim="dataPage.facade.deleteFlag">
          <el-option label="未消费" value="0"></el-option>
          <el-option label="已消费" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消费时间">
        <DatePickerRange
          v-model:start="dataPage.facade.deleteTimeStart"
          dateRangeType="daterange"
          v-model:end="dataPage.facade.deleteTimeEnd"
        ></DatePickerRange>
      </el-form-item>
      <el-form-item label="业务编号">
        <el-input v-model.trim="dataPage.facade.businessId" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="应用编码">
        <el-input v-model.trim="dataPage.facade.appCode" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </SearchForm>
    <div class="option_box">
      <TableModel
        :page="dataPage.page"
        :listTableData="dataPage.dataList"
        :dataPage="dataPage"
        :loading="dataPage.loadingData"
        @pagingQuery="searchQueryHarder"
      >
        <YbtTableColumn prop="_id" label="消息id" width="180"></YbtTableColumn>
        <YbtTableColumn prop="businessId" label="业务编号" min-width="170"></YbtTableColumn>
        <YbtTableColumn prop="appCode" label="渠道编码" width="150"></YbtTableColumn>
        <YbtTableColumn prop="appName" label="应用名称" min-width="170"></YbtTableColumn>
        <YbtTableColumn prop="body" label="消息" min-width="300">
          <template #default="{ row }">
            <div class="p-8">
              <el-collapse>
                <el-collapse-item :title="dataPage.topic[row.topic]" name="1">
                  <div class="json_content">
                    <json-viewer :value="jsonValue(row.body)" :expand-depth="5" copyable boxed sort class="w-100%"></json-viewer>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="deleteFlag" label="是否消费" width="120">
          <template #default="{ row }">{{row.deleteFlag == 1 ?"已消费":"未消费"}}</template>
        </YbtTableColumn>
        <YbtTableColumn prop="createTime" label="创建时间" width="170"></YbtTableColumn>
        <YbtTableColumn prop="createBy" label="创建者" width="170"></YbtTableColumn>
        <YbtTableColumn prop="deleteTime" label="消费时间" width="170"></YbtTableColumn>
      </TableModel>
    </div>
  </PageContainer>
</template>
<style lang="scss" scoped></style>