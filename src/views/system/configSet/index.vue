<script setup lang="ts">
defineOptions({
  name: 'sysConfig'
})
import configSet_api from '@/api/configSet/index'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import { ElButton, ElMessage } from 'element-plus'
import ConfigEditModel from './ConfigEditModel.vue'
type TotherData = {
  showRecharge: Boolean
  curryInfo: any
}
const dataPage: IPage<any, any> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    name: '',
    key: ''
  },
  otherData: {
    showRecharge: false,
    curryInfo: {}
  },
  refreshLoading: false,
  dataList: [],
  selectPage: configSet_api.A_getSysConfigList
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

const editConfigHandler = (type: 'add' | 'edit', row?: any) => {
  otherData.value.curryInfo = row
  otherData.value.showRecharge = true
}

const refreshAllRedisCacheHandler = () => {
  dataPage.refreshLoading = true
  configSet_api
    .A_refreshAllRedisCache({})
    .then(() => {
      ElMessage.success('刷新成功！')
      searchQueryHarder()
    })
    .finally(() => {
      dataPage.refreshLoading = false
    })
}
const jsonValue = computed(() => {
  return function (val: any) {
    if (!val) return val
    try {
      return JSON.parse(val)
    } catch (e) {
      return val
    }
  }
})

const isValidJson = (str: any) => {
  if (typeof str !== 'string') return false
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const parseJson = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}
</script>
<template>
  <PageContainer class="main_box">
    <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
      @search="searchQueryHarder">
      <el-form-item label="参数名称">
        <el-input v-model.trim="dataPage.facade.name" placeholder="请输入参数名称"></el-input>
      </el-form-item>
      <el-form-item label="参数键名">
        <el-input v-model.trim="dataPage.facade.key" placeholder="请输入参数键名"></el-input>
      </el-form-item>
    </SearchForm>
    <div class="option_box">
      <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" :dataPage="dataPage"
        @pagingQuery="searchQueryHarder">
        <template #option>
          <el-button type="primary" @click="editConfigHandler('add')">新增</el-button>
          <el-button type="warning" @click="refreshAllRedisCacheHandler"
            :loading="dataPage.refreshLoading">刷新缓存</el-button>
        </template>
        <YbtTableColumn prop="name" label="参数名称" min-width="100"></YbtTableColumn>
        <YbtTableColumn prop="paramValue" label="参数键名/键值" min-width="200">
          <template #default="{ row }">
            <div class="p-8">
              <el-collapse>
                <el-collapse-item :title="row.paramKey" name="1">
                  <div class="json_content">
                    <template v-if="isValidJson(row.paramValue)">
                      <json-viewer :value="parseJson(row.paramValue)" :expand-depth="5" copyable boxed sort
                        class="w-100% bg-#999"></json-viewer>
                    </template>
                    <template v-else>
                      <pre>{{ row.paramValue }}</pre>
                    </template>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="remark" label="备注" show-overflow-tooltip width="200"></YbtTableColumn>
        <YbtTableColumn prop label="操作" fixed="right" align="right" width="100">
          <template #default="{ row }">
            <el-button type="text" @click="editConfigHandler('edit', row)">编辑</el-button>
          </template>
        </YbtTableColumn>
      </TableModel>
    </div>
    <ConfigEditModel v-model="otherData.showRecharge" :curryInfo="otherData.curryInfo" @refresh="searchQueryHarder">
    </ConfigEditModel>
  </PageContainer>
</template>
<style lang="scss" scoped>
.json_content {
  padding: 4px;
  background-color: #999;
  border-radius: 4px;
}
</style>
