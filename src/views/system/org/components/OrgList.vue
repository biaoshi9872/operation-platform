<!--
 * @Descripttion: 
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-04-17 09:22:09
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-04-20 10:10:18
-->

<script setup lang="ts" name="RoleList">
import org_api from '@/api/system/org'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import OrgModel from './OrgModel.vue'
const { isOrgLast, orgInfo } = isStateCheckHooks()
const props = defineProps({
  curryOrgInfo: {
    type: Object,
    default: {}
  }
})
const emits = defineEmits<{
  (e: 'change', val: any): void
  (e: 'update:curryOrgInfo', val: any): void
}>()
const dataInfo = reactive({
  orgName: '',
  showOrgModel: false,
  type: 'edit',
  dataSource: []
})
onMounted(() => {
  getList()
})
const editHandler = (node: any, data: any) => {
  emits('update:curryOrgInfo', data)
  dataInfo.type = 'edit'
  dataInfo.showOrgModel = true
}
const addHandler = (node: any, data: any) => {
  dataInfo.type = 'add'
  dataInfo.showOrgModel = true
}
const nodeClick = (data: any) => {
  emits('update:curryOrgInfo', data)
}
const getList = () => {
  org_api.A_orgTree({ orgName: dataInfo.orgName }).then((res: any) => {
    dataInfo.dataSource = res
    emits('update:curryOrgInfo', isOrgLast.value ? orgInfo.value : dataInfo.dataSource[0])
  })
}
</script>

<template>
  <div class="main_box">
    <div class="header-container">
      <h3>组织机构</h3>
      <el-button type="primary" @click="addHandler">新增</el-button>
    </div>
    <div class="search-row">
      <el-input v-model="dataInfo.orgName" placeholder="请输入关键字进行过滤" clearable />
      <el-button type="primary" class="ml-5" @click="getList">查询</el-button>
    </div>
    <div class="mt-12">
      <el-tree style="max-width: 600px" :data="dataInfo.dataSource" node-key="id" default-expand-all
        :expand-on-click-node="false" :props="{ label: 'name', children: 'child' }" @node-click="nodeClick">
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <span>{{ node.label }}</span>
            <div>
              <el-button type="primary" class="edit-org" link @click="editHandler(node, data)">修改</el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
  <OrgModel v-model="dataInfo.showOrgModel" :curryInfo="curryOrgInfo" :type="dataInfo.type" @refresh="getList">
  </OrgModel>
</template>

<style lang="scss" scoped>
.main_box {
  background-color: var(--el-searchForm-bg-color);
  padding: 12px;
  height: 100%;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #3333;
    margin-bottom: 24px;
    padding: 0 0 12px 0;
  }

  .custom-tree-node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .edit-org {
    display: none;
  }

  .custom-tree-node:hover {
    .edit-org {
      display: block;
    }
  }

  .search-row {
    display: flex;
  }
}
</style>
