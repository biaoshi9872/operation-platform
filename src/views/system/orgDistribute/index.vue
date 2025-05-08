<script setup lang="ts" name="Authority">
defineOptions({
  name: 'Authority'
})
import type { FormInstance, FormRules, ElTree } from 'element-plus'
import menu_api from '@/api/system/menu'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'

const data = reactive({
  treeList: [{}],
  checkedList: [],
  submitLoading: false,
  permissionIds: '' as any
})
const { treeList, checkedList, submitLoading } = toRefs(data)

const allTree = ref<InstanceType<typeof ElTree>>()
function getAllChecked() {
  //@ts-ignore
  const keys = allTree.value.getCheckedKeys()
  //@ts-ignore
  const halfKeys = allTree.value.getHalfCheckedKeys()
  return [...keys, ...halfKeys]
}

// 菜单结构
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

// 菜单结构
async function getAllAutoTreeList() {
  const res: any = await menu_api.A_menuManageTree({ menuType:2, menuName: '' })
  data.treeList = res
  const checkNode = [] as any
  res.forEach((item: any) => {
    if (item.selected == 1) checkNode.push(item.id)
    getPermission(checkNode, item)
  })
  console.log([...new Set(checkNode)], 'checkNode')
  data.checkedList = filterTreeFullSelect(res, [...new Set(checkNode)])
}

const getPermission = (checkNode: any, curryData: any) => {
  if (curryData.selected == 1) checkNode.push(curryData.id)
  if (curryData.children) {
    curryData.children.forEach((item: any) => {
      getPermission(checkNode, item)
    })
  }
}

onMounted(getAllAutoTreeList)

function handleSubmit() {
  const permissionIds = getAllChecked()

  if (!permissionIds) {
    return ElMessage.warning('页面权限设置不能为空！')
  }

  ElMessageBox.confirm('请确认是否修改完毕，保存权限！', '保存权限', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    submitLoading.value = true
    menu_api.A_signSelected({ selectMenuIds: permissionIds, menuType: 2 })
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
  <div class="permission-tree">
    <ModalContent title="页面权限">
      <el-tree
        ref="allTree"
        :data="treeList"
        show-checkbox
        highlight-current
        node-key="id"
        :props="{ children: 'children', label: 'name' }"
        :default-checked-keys="checkedList"
        default-expand-all="true"
      />
    </ModalContent>
    <div class="mt-20 text-center permission-bottom">
      <el-button authKey="VO_AUTHORITY_SAVE" type="primary" :loading="submitLoading" @click="handleSubmit">保存权限</el-button>
    </div>
  </div>
</template>

<style lang="scss">
.permission-tree {
  position: relative;
  background-color: var(--el-searchForm-bg-color);
  min-height: calc(100vh - 110px);
  display: flex;
  flex: 1;
  overflow: hidden;

  .permission-bottom {
    position: fixed;
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
