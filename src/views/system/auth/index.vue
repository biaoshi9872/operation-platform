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
  const menuIdList = webPermission.value.getAllChecked()
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
    <div class="border-rd-2 common-bg p-16">
      <RoleList @change="handleRoleChange" />
    </div>
    <div class="manage-wrap">
      <div v-show="curRole" v-loading="loading" class="mb-16">
        <AuthItem ref="webPermission" :tree="webList" :initial-checked="webChecked" :curRole="curRole" :showOption="showOption" />
      </div>
      <div class="permission-bottom" v-if="!isNullOrUnDefOrisEmpty(curRole?.id)">
        <OptionModel>
          <el-button v-if="showOption" type="primary" :loading="submitLoading" @click="handleSubmit">保存权限</el-button>
        </OptionModel>
      </div>
    </div>
  </PageContainer>
</template>

<style lang="scss" scoped>
.auth-page {
  min-height: calc(100vh - 110px);
  display: flex;
  gap: 6px;
}
.manage-wrap {
  flex: 1;
  position: relative;
  background-color: var(--el-searchForm-bg-color);
  .permission-bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    background-color: var(--el-searchForm-bg-color);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    box-shadow: 0px -1px 4px rgba(10, 50, 97, 0.1);
  }
}
</style>
