<!--
 * @Descripttion: 
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-04-17 09:22:09
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-04-20 10:10:18
-->

<script setup lang="ts" name="RoleList">
import role_api from '@/api/system/role'
import org_api from '@/api/system/org'
import system_num from '@/utils/constant/system'
import OrgModel from './OrgModel.vue'

const emits = defineEmits<{
  (e: 'change', val: any): void
}>()
const dataInfo = reactive({
  orgName: '',
  showOrgModel: true,
  curryInfo: {},
  dataSource: []
})
onMounted(() => {
  getList()
})
const editHandler = (node: any, data: any) => {}
const addHandler = (node: any, data: any) => {
  dataInfo.showOrgModel = true
}

const removeHandler = (node: any, data: any) => {}

const getList = () => {
  org_api.A_orgTree({ orgName: dataInfo.orgName }).then((res: any) => {
    dataInfo.dataSource = res
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
    <div>
      <el-tree
        style="max-width: 600px"
        :data="dataInfo.dataSource"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :props="{ label: 'name' ,children: 'child' }"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <span>{{ node.label }}</span>
            <div>
              <el-button type="primary" class="edit-org" link @click="editHandler(node,data)">修改</el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
  <OrgModel v-model="dataInfo.showOrgModel" :curryInfo="dataInfo.curryInfo"></OrgModel>
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
