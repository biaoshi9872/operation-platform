<script setup lang="ts" name="RoleList">
import role_api from '@/api/system/role'
import system_num from '@/utils/constant/system'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { isOrgLast } = isStateCheckHooks()
const emits = defineEmits<{
  (e: 'change', val: any): void
}>()

const data = reactive({
  roleName: '',
  loading: false,
  roleList: []
})

const { roleList, roleName, loading } = toRefs(data)

function getList() {
  loading.value = true
  const orgType: any = null
  role_api
    .A_permissionRoleList({ roleName: roleName.value, orgType })
    .then((data: any) => {
      roleList.value = data || []
    })
    .finally(() => {
      loading.value = false
    })
}

// 选中当前行
function handleRoleChange(val: any) {
  emits('change', val)
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="main_box">
    <h3 class="mb-10">角色列表</h3>
    <div class="search-row mb-12">
      <el-input v-model="roleName" placeholder="请输入角色名称" clearable />
      <el-button type="primary" class="ml-5" @click="getList">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="roleList" highlight-current-row height="650px"
      @current-change="handleRoleChange">
      <YbtTableColumn v-if="!isOrgLast" label="机构类型" prop="name">
        <template #default="{ row }">{{ system_num.getRoleType(row.createRoleType) }}</template>
      </YbtTableColumn>
      <YbtTableColumn label="角色" prop="name" minWidth="200">
        <template #default="{ row }">
          <div class="role-name">
            <div>{{ row.name }}</div>
            <div class="role-type">{{ row.createRoleType == '2' ? '(公用)' : '' }}</div>
          </div>
        </template>
      </YbtTableColumn>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.main_box {
  background-color: var(--el-searchForm-bg-color);
  min-width: 300px;

  .search-row {
    display: flex;
  }

  .role-name {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .role-type {
      color: var(--el-color-success);
    }
  }
}
</style>
