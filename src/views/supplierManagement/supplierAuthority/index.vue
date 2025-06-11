<script setup lang="ts" name="Authority">
defineOptions({
    name: 'Authority'
})
import supplier_api from '@/api/supplier'
import menu_api from '@/api/system/menu'
import role_api from '@/api/system/role'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
const data = reactive({
    supplierRoleList: [],
    treeList: [{}],
    checkedList: [],
    submitLoading: false,
    permissionIds: '' as any
})


onMounted(() => {
    getAllAutoTreeList()
    getSupplierRoleList()
})

//角色树
const getAllAutoTreeList = () => {
    const roleId = data.supplierRoleList?.[0]?.id
    Promise.all([
        menu_api.A_menuManageTree({ menuType: 4, menuName: '' }),
        role_api.A_permissionList({ roleId })
    ]).then(res => {
        data.treeList = res[0] as any
        data.checkedList = res[1] as any
    })
}

//角色列表
const getSupplierRoleList = () => {
    supplier_api.A_getRoleList({}).then(res => {
        data.supplierRoleList = res as any
        getAllAutoTreeList()
    })
}
let webPermission = ref(null)
function handleSubmit() {
    //@ts-ignore
    const menuIdList = webPermission.value.getCheckedNodes().map(item => item.id)
    const roleId = data.supplierRoleList?.[0]?.id
    if (!menuIdList.length) {
        return ElMessage.warning('权限设置不能为空！')
    }
    ElMessageBox.confirm('请确认是否修改完毕，保存权限！', '保存权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        data.submitLoading = true
        role_api
            .A_setPermission({ roleId, menuIdList })
            .then(res => {
                ElMessage.success('设置成功')
            })
            .finally(() => {
                data.submitLoading = true
            })
    })
}
</script>

<template>
    <div class="permission-tree">
        <div class="permission-tree-box">

        </div>
        <div>
            <el-tree :data="data.treeList" ref="webPermission" :props="{
                label: 'name',
                children: 'children'

            }" :default-checked-keys="data.checkedList" show-checkbox node-key="id">
            </el-tree>
        </div>
        <div class="mt-20 text-center permission-bottom">
            <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">保存权限</el-button>
        </div>
    </div>
</template>

<style lang="scss"></style>
