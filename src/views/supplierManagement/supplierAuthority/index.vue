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
                data.submitLoading = false
            })
    })
}

const options = []
</script>

<template>
    <div class="permission-tree">
        <div class="permission_content">
            <div class="permission-tree-box">
                <h3 class="mt-12">角色:渠道自营供应商</h3>
                <div class="color-#666 mb-12 mt-4">此用户角色及其权限为所有渠道自营供应商共用</div>
            </div>
            <div>
                <TreeAuth v-model:selectedIds="data.checkedList" ref='webPermission' :treeList="data.treeList">
                </TreeAuth>
            </div>
        </div>
        <div class=" text-center permission-bottom——box">
            <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">保存权限</el-button>
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

    .permission-bottom——box {
        position: sticky;
        padding: 8px 0;
        height: 60px;
        margin: 8px 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        z-index: 999;
        box-shadow: 0 0 2px #ccc;
    }
}
</style>
