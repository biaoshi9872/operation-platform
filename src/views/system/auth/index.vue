<script setup lang="ts">
defineOptions({
  name: 'auth'
})
import RoleList from './components/RoleList.vue'
import AuthItem from './components/AuthItem.vue'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { isNullOrUnDefOrisEmpty } from '@/utils/is'
import role_api from '@/api/system/role'
import menu_api from '@/api/system/menu'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { isOrgLast, orgInfo } = isStateCheckHooks()

const showOption = computed(() => {
  if (!isOrgLast.value) return true
  else {
    if (curRole.value?.createRoleType == 2 && isOrgLast.value) {
      return false
    } else {
      return true
    }
  }
})

const data = reactive({
  loading: false,
  webList: [{}],
  webChecked: [],
  submitLoading: false
})
const { loading, webList, webChecked, submitLoading } = toRefs(data)
const webPermission = ref<InstanceType<typeof AuthItem>>()
const curRole = ref<any>()

watch(curRole, () => {
  curRole.value?.name && getPermission()
})

function filterTreeFullSelect(tree: any, selected: any) {
  const setStore = new Set(selected)
  const fullSelectList: any = []
  if (Array.isArray(tree)) {
    tree.forEach(item => checkIsChecked(item))
  }
  function checkIsChecked(node: any) {
    let isChecked
    if (Array.isArray(node.children) && node.children.length) {
      let checkedCount = 0
      for (let i = 0; i < node.children.length; i++) {
        checkIsChecked(node.children[i]) && checkedCount++
      }
      isChecked = checkedCount === node.children.length
    } else {
      isChecked = setStore.has(node.id)
    }
    isChecked && fullSelectList.push(node.id)
    return isChecked
  }
  return fullSelectList
}
function getPermission() {
  loading.value = true
  Promise.all([getCheckPermission(), getAllAutoTreeList()])
    .then(res => {
      webChecked.value = filterTreeFullSelect(res[1], res[0])
      webList.value = res[1]
    })
    .finally(() => {
      loading.value = false
    })
}
//已选中的权限
function getCheckPermission() {
  return role_api.A_permissionList({
    roleId: curRole.value?.id
  })
}
// 菜单结构
function getAllAutoTreeList() {
  const menuType = curRole.value.createRoleType == 1 ? 1 : 2
  return menu_api.A_menuManageTree({ menuType, menuName: '' })
}

function handleRoleChange(val: any) {
  curRole.value = val
}
function handleSubmit() {
  //@ts-ignore
  const menuIdList = webPermission.value.getCheckedNodes().map(item => item.id)
  const roleId = curRole.value?.id
  if (!menuIdList.length) {
    return ElMessage.warning('权限设置不能为空！')
  }

  ElMessageBox.confirm('请确认是否修改完毕，保存权限！', '保存权限', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    submitLoading.value = true
    role_api
      .A_setPermission({ roleId, menuIdList })
      .then(res => {
        ElMessage.success('设置成功')
      })
      .finally(() => {
        submitLoading.value = false
      })
  })
}
</script>

<template>
  <PageContainer class="auth-page">
    <div class=" border-rd-2 common-bg p-16">
      <RoleList @change="handleRoleChange" />
    </div>
    <div class="manage-wrap">
      <div v-show="curRole" v-loading="loading" class="mb-16">
        <h3 class="mb-12 mt-12">权限设置</h3>
        <TreeAuth v-model:selectedIds="webChecked" ref='webPermission' :treeList="webList" :curRole="curRole"
          :showOption="showOption" />
      </div>
      <div class="permission-bottom" v-if="!isNullOrUnDefOrisEmpty(curRole?.id)">
        <el-button v-if="showOption" type="primary" :loading="submitLoading" @click="handleSubmit">保存权限</el-button>
      </div>
    </div>
  </PageContainer>
</template>

<style lang="scss" scoped>
.auth-page {
  height: calc(100vh - 120px);
  display: flex;
  gap: 12px;
}

.manage-wrap {
  flex: 1;
  background-color: #fff;
  position: relative;
  padding: 0 24px;
  height: 100%;
  overflow-y: auto;

  .permission-bottom {
    position: sticky;
    padding: 8px 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    background-color: #fff;
    z-index: 999;
    box-shadow: 0 0 2px #ccc;
  }
}
</style>
