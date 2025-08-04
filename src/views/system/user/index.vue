<script setup lang="ts" name="userSet">
defineOptions({
  name: 'user'
})
import org_api from '@/api/system/org/index'
import user_api from '@/api/system/user/index'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import { ElButton, ElMessage, ElMessageBox, ElTree } from 'element-plus'
import EditUser from './components/EditUser.vue'
import ResetPassword from './components/ResetPassword.vue'

const { isOrgLast, orgInfo } = isStateCheckHooks()
const tree = ref<InstanceType<typeof ElTree>>()
const defaultValueConversionHandler = () => {
  dataPage.facadeKz.orgId = isOrgLast.value ? orgInfo.value.id : ''
}
const dataPage: IPage<any, any> = reactive({
  defaultValueConversion: defaultValueConversionHandler,
  isOnload: false,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    usernameOrPhone: ''
  },
  facadeKz: {
    orgId: ''
  },
  dataList: [],
  dataListLoading: false,
  curDepartment: null,
  showEditDepartment: false,
  isAddDepartment: false,
  showEditUser: false,
  showResetPassword: false,
  selectPage: user_api.A_pageList
})
const { searchQuery } = pageHooks(dataPage)

onMounted(() => {
  getOrgTreeList()
})

const defaultCheckedKeys = ref<any[]>()
const departmentData = ref<any>()
const curUser = ref<any>()

function getOrgTreeList() {
  org_api.A_orgTree({}).then(res => {
    departmentData.value = res as any
    dataPage.curDepartment = isOrgLast.value ? orgInfo.value : (departmentData.value[0] as any)
    const firstKey: number = <number>dataPage.curDepartment.id
    defaultCheckedKeys.value = [firstKey]
  })
}

function handleCurrentChange(val: any) {
  dataPage.curDepartment = val
}

watch(
  () => dataPage.curDepartment,
  () => {
    dataPage.facadeKz.orgId = dataPage.curDepartment?.id
    searchQueryHandler()
  }
)

// 新增用户
function handleAdd() {
  dataPage.showEditUser = true
  curUser.value = null
}

// 编辑用户
function handleEditUser(row: any) {
  dataPage.showEditUser = true
  curUser.value = row
}

// 修改密码
function handleRestPassword(row: any) {
  curUser.value = row
  dataPage.showResetPassword = true
}

// 删除用户
async function handleDelete({ id }: { id: number }) {
  ElMessageBox.confirm(`请确认是否删除该用户?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    user_api.A_deleteUser(id).then(res => {
      ElMessage.success(`删除成功!`)
      searchQueryHandler()
    })
  })
}
/**查询参数 */
const getQueryParams = () => {
  const { page, facade, facadeKz } = dataPage
  return { ...page, ...facade, ...facadeKz }
}

// 查询回调
const searchQueryHandler = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}
</script>

<template>
  <PageContainer v-loading="dataPage.loadingData">
    <el-container>
      <el-aside v-if="!isOrgLast" class="w-220 border-rd-2 common-bg p-16 common-shadow">
        <el-tree ref="tree" :data="departmentData" :props="{ children: 'child', label: 'name' }" node-key="id"
          :default-checked-keys="defaultCheckedKeys" default-expand-all highlight-current :expand-on-click-node="false"
          @current-change="handleCurrentChange" class="departmentTree" />
      </el-aside>
      <el-main class="pt-0">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page"
          @search="searchQueryHandler">
          <el-form-item label="账号/手机号" title="账号/手机号">
            <el-input v-model="dataPage.facade.usernameOrPhone" placeholder="请输入账号/手机号" clearable />
          </el-form-item>
        </SearchForm>
        <TableModel :page="dataPage.page" :loading="dataPage.loadingData" :listTableData="dataPage.dataList"
          :dataPage="dataPage">
          <template #option>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </template>
          <YbtTableColumn label="账号" prop="username" />
          <YbtTableColumn label="姓名" prop="name" />
          <YbtTableColumn label="手机号" prop="mobile" />
          <YbtTableColumn label="角色" prop="roleNameList">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.ifAdminAccount">超级管理员</el-tag>
              <div v-else>
                <OverflowTooltipCell :text="scope.row.roleNameList?.join('、')">
                  <el-tag v-for="(item, index) in scope.row.roleNameList" :key="index" class="mr-4" type="success">{{
                    item }}</el-tag>
                </OverflowTooltipCell>
              </div>
            </template>
          </YbtTableColumn>
          <YbtTableColumn label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '正常' : '禁用'
                }}</el-tag>
            </template>
          </YbtTableColumn>
          <YbtTableColumn label="创建时间" prop="createDate" width="200" />
          <YbtTableColumn label="操作" width="200" align="right">
            <template #default="{ row }">
              <div class="btnStatus">
                <el-button v-if="!row?.roleNameList?.includes('渠道自营供应商')" type="text"
                  @click="handleEditUser(row)">编辑</el-button>
                <el-button type="text" @click="handleRestPassword(row)">重置密码</el-button>
                <el-button type="text" v-if="!row.ifAdminAccount && !row?.roleNameList?.includes('渠道自营供应商')"
                  @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </YbtTableColumn>
        </TableModel>
      </el-main>
    </el-container>
  </PageContainer>
  <!-- 新增/编辑用户 -->
  <EditUser v-if="dataPage.curDepartment" :curUser="curUser" :curDepartment="dataPage.curDepartment"
    v-model="dataPage.showEditUser" @update="searchQueryHandler" />
  <!-- 修改密码 -->
  <ResetPassword :userId="curUser?.id" v-model="dataPage.showResetPassword" />
</template>

<style lang="scss" scoped>
.departmentTree {
  ::v-deep(.el-tree-node) {
    .el-tree-node__content {
      height: auto;
      padding: 0.125rem 0;

      .el-tree-node__label {
        white-space: pre-wrap;
      }
    }
  }
}
</style>
