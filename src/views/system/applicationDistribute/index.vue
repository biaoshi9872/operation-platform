<script setup lang="ts" name="Authority">
defineOptions({
  name: 'Authority'
})
import menu_api from '@/api/system/menu'
import type { ElTree } from 'element-plus'
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
  const res: any = await menu_api.A_menuManageTree({ menuType: 3, menuName: '' })
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

const webPermission: any = ref(null)
function handleSubmit() {
  const permissionIds = webPermission.value.getCheckedNodes().map(item => item.id)
  if (!permissionIds) {
    return ElMessage.warning('页面权限设置不能为空！')
  }
  ElMessageBox.confirm('请确认是否修改完毕，保存权限！', '保存权限', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    submitLoading.value = true
    menu_api.A_signSelected({ selectMenuIds: permissionIds, menuType: 3 })
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
    <div class="permission_content">
      <TreeAuth v-model:selectedIds="data.checkedList" ref='webPermission' :treeList="data.treeList">
      </TreeAuth>
    </div>
    <div class="text-center permission-bottom——box">
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存权限</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.permission-tree {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  overflow: scroll;
  background-color: #fff;
  position: relative;
  padding: 0 24px;
  margin-top: 24px;

  .permission-bottom——box {
    position: sticky;
    padding: 8px 0;
    height: 100px;
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
