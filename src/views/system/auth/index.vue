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

const data = reactive({
  loading: false,
  webList: [{}],
  webChecked: [],
  submitLoading: false
})
const { loading, webList, webChecked, submitLoading } = toRefs(data)
const webPermission = ref<InstanceType<typeof AuthItem>>()
const curRole = ref<any>()

onMounted(() => {
  getAllAutoTreeList()
})

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

// 单个角色选中
function getPermission() {
  loading.value = true
  //@ts-ignore
  role_api
    .A_permissionList({
      roleId: curRole.value?.id
    })
    .then(data => {
      webChecked.value = filterTreeFullSelect(webList.value, data)
    })
    .finally(() => {
      loading.value = false
    })
}

// 菜单结构
function getAllAutoTreeList() {
  menu_api.A_menuManageTree({ menuType: 1, menuName: '' }).then((res: any) => {
    webList.value = res
  })
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
  <PageContainer>
    <el-container>
      <el-aside class="w-220 border-rd-2 common-bg p-16">
        <RoleList @change="handleRoleChange" />
      </el-aside>
      <el-main class="pt-0">
        <div v-show="curRole" v-loading="loading" class="mb-16">
          <div class="permission-content">
            <div class="permission-item">
              <AuthItem ref="webPermission" :tree="webList" :initial-checked="webChecked" />
            </div>
          </div>
        </div>
        <div class="permission-bottom" v-if="!isNullOrUnDefOrisEmpty(curRole?.id)">
          <OptionModel>
            <el-button authKey="VO_AUTH_UPDATEPWD" type="primary" :loading="submitLoading" @click="handleSubmit">保存权限</el-button>
          </OptionModel>
        </div>
      </el-main>
    </el-container>
  </PageContainer>
</template>

<style lang="scss" scoped>
.permission-bottom {
  position: fixed;
  bottom: 0;
  width: calc(100% - 460px);
  background-color: var(--el-searchForm-bg-color);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  box-shadow: 0px -1px 4px rgba(10, 50, 97, 0.1);
}
</style>
