<!--
 * @Descripttion: 
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-04-27 11:37:49
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-04-28 09:57:15
-->
<!-- 下载记录-->
<template>
  <el-dialog :model-value="dialogVisible" title="下载记录" width="50%" closeOnClickModal>
    <TableModel
      :listTableData="dataPage.dataList"
      :dataPage="dataPage"
      :page="dataPage.page"
      @pagingQuery="pagingQueryHander"
      @selection-change="handleSelectionChange"
    >
      <YbtTableColumn
        v-for="(item, index) in columnList"
        :prop="item.filed"
        :label="item.title"
        :align="item.type == 'number' ? 'right' : item.type == 'center' ? 'center' : 'left'"
        :key="index"
      ></YbtTableColumn>
    </TableModel>
  </el-dialog>
</template>

<script lang="ts" setup name="downloadRecord">
import { reactive, watch } from 'vue'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import { A_downloadRecordApi } from '@/api/downloadCenter'
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number,
    required: true
  }
})
watch(
  () => props.id,
  value => {
    dataPage.facade.recordId = value
  }
)
const columnList = [
  {
    title: '用户',
    filed: 'userName',
    type: 'input',
    sort: 0
  },
  {
    title: '下载时间',
    filed: 'createTime',
    type: 'input',
    sort: 1
  }
].sort((a: any, b: any) => {
  return a.sort - b.sort
})

const dataPage: IPage<any, any> = reactive({
  selectPage: A_downloadRecordApi,
  dataList: [],
  page: {
    page: 1,
    limit: 10,
    total: 0
  },
  isOnload: true,
  facade: {
    recordId: props.id
  }
})

const { handleSelectionChange, pagingQuery } = pageHooks(dataPage)

// 分页回调
const pagingQueryHander = () => {
  const { page, facade } = dataPage
  const obj = { ...page, ...facade }
  pagingQuery(obj)
}
</script>
<style scoped lang="scss"></style>
