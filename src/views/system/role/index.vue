<script setup lang="ts" name="roleSet">
defineOptions({ name: 'role' })
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import EditRole from './components/EditRole.vue'
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import { Edit, Download } from '@element-plus/icons-vue'
import role_api from '@/api/system/role/index'
import system_num from '@/utils/constant/system'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { isOrgLast } = isStateCheckHooks()

//@ts-ignore
const dataPage: IPage<any, any> = reactive({
  showEdit: false,
  isOnload: true,
  facade: {
    roleName: ''
  },
  dataList: [],
  curryInfo: null,
  dataListLoading: false,
  selectPage: role_api.A_rolePageList
})

const { searchQuery } = pageHooks(dataPage)

const handleAdd = () => {
  dataPage.curryInfo = null
  dataPage.showEdit = true
}
const handleEdit = (row: any) => {
  dataPage.curryInfo = row
  dataPage.showEdit = true
}

/**查询参数 */
const getQueryParams = () => {
  const { page, facade } = dataPage
  return { ...page, ...facade }
}

// 查询回调
const searchQueryHandler = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}

async function handleDelete({ id }: { id: number }) {
  ElMessageBox.confirm(`请确认是否删除改角色?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    role_api.A_roleDelete(id).then(res => {
      ElMessage.success(`删除成功!`)
      searchQueryHandler()
    })
  })
}

const showOption = computed(() => {
  return function(row: any) {
    if (!isOrgLast.value) return true
    else {
      if (row.createRoleType == 2 && isOrgLast.value) {
        return false
      } else {
        return true
      }
    }
  }
})
</script>

<template>
  <PageContainer v-loading="dataPage.loadingData">
    <SearchForm v-model:model="dataPage.facade" class="el-search-item" @search="searchQueryHandler">
      <el-form-item label="角色名称">
        <el-input v-model.trim="dataPage.facade.roleName" placeholder="请输角色名称" clearable />
      </el-form-item>
    </SearchForm>
    <TableModel
      :page="dataPage.page"
      v-loading="dataPage.loadingData"
      :listTableData="dataPage.dataList"
      :dataPage="dataPage"
      :isShowPagination="false"
      :tree-props="{ children: 'children' }"
      default-expand-all
    >
      <template #option>
        <el-button authKey="sys:role:add" type="primary" @click="handleAdd()">新增</el-button>
      </template>
      <YbtTableColumn label="ID" prop="id" />
      <YbtTableColumn label="角色名称" prop="name">
        <template #default="{ row }">
          <div class="role-name">
            <div>{{ row.name }}</div>
            <div class="role-type">{{ row.createRoleType == '2'?'(公用)':'' }}</div>
          </div>
        </template>
      </YbtTableColumn>
      <YbtTableColumn label="创建时间" prop="createDate" />
      <YbtTableColumn v-if="!isOrgLast" label="机构类型" prop="createRoleType">
        <template #default="{ row }">{{ system_num.getRoleType(row.createRoleType) }}</template>
      </YbtTableColumn>
      <YbtTableColumn label="创建人" prop="createUserName" />
      <YbtTableColumn label="操作" width="240" align="right">
        <template #default="{ row }">
          <div v-if="showOption(row)">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </YbtTableColumn>
    </TableModel>
  </PageContainer>

  <EditRole v-model="dataPage.showEdit" :curryInfo="dataPage.curryInfo" @refresh="searchQueryHandler" />
</template>

<style lang="scss" scoped>
.role-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .role-type {
    color: var(--el-color-success);
  }
}
</style>
