<script setup lang="ts">
defineOptions({
    name: 'xxxx'
})
import AnnouncementDialog from '@/views/system/components/announcement/AnnouncementDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import AppFilesEditModel from './components/AppFilesEditModel.vue'
import AppFadeModel from './components/AppFadeModel.vue'
import { ElButton } from 'element-plus'
import apiFiles_api from '@/api/apiFiles/index'
const router = useRouter()
const dataPage = reactive({
    curryInfo: null,
    showAddModel: false,
    showFlModel: false,
    nodeCurryInfo: null,
    treeList: [],
    tableData: [],
    showAnnouncementDialog: false,
    type: 1
})
const addHandler = () => {
    dataPage.curryInfo = null
    dataPage.showFlModel = true
}

const defaultProps = {
    children: 'child',
    label: 'name'
}

const appendHandler = (row: any) => {
    dataPage.curryInfo = row
    dataPage.showFlModel = true
}
const openAnnouncementDialog = (row: any) => {
    dataPage.curryInfo = row
    dataPage.showAnnouncementDialog = true
}
const removeHandler = (row: any) => {
    ElMessageBox.confirm('确定删除该目录吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        apiFiles_api.A_delete(row.id
        ).then((res: any) => {
            ElMessage.success('删除成功！')
            initData()
        })
    })
}

const handleNodeClick = (data: any) => {
    dataPage.nodeCurryInfo = data
    getListByCateId()
}

const addApiHandler = () => {
    if (!dataPage.nodeCurryInfo) {
        return ElMessage.warning('请选择一个目录！')
    }
    dataPage.curryInfo = null
    dataPage.showAddModel = true
}

const deleteApiHandler = (row: any) => {
    ElMessageBox.confirm('确定删除该接口吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        apiFiles_api.A_apiInterfaceDelete(
            row.id
        ).then((res: any) => {
            ElMessage.success('删除成功！')
            getListByCateId()
        })
    })
}

const editApiHandler = (row: any) => {
    dataPage.curryInfo = row
    dataPage.showAddModel = true

}

onMounted(() => {
    initData()
})
const getListByCateId = () => {
    const cateId = dataPage?.nodeCurryInfo?.id || null
    if (cateId) {
        apiFiles_api.A_listByCateId(cateId).then((res: any) => {
            dataPage.tableData = res
        })
    }
}
const initData = () => {
    apiFiles_api.A_treeList({
        type: dataPage.type
    }).then((res: any) => {
        dataPage.treeList = res
    })
}

</script>
<template>
    <div class="api_box_box">
        <div class="main_box_left">
            <el-card>
                <template #header>
                    <div class="flex  justify-between items-center">
                        <h3>目录名称</h3>
                        <el-button type="primary" @click="addHandler">新增</el-button>
                    </div>
                </template>
                <div>
                    <el-tree node-key="id" :data="dataPage.treeList" :props="defaultProps"
                        @node-click="handleNodeClick">
                        <template #default="{ node, data }">
                            <div class="custom-tree-node">
                                <span class="node-title">
                                    <el-tooltip :content="node.label" placement="top">
                                        <div ref="tooltipRef" class="overflow-tooltip-cell">
                                            {{ node.label }}</div>
                                    </el-tooltip>
                                </span>
                                <div class="flex">
                                    <el-button type="primary" link @click="appendHandler(data)">
                                        编辑
                                    </el-button>
                                    <el-button style="margin-left: 4px" type="danger" link @click="removeHandler(data)">
                                        删除
                                    </el-button>
                                </div>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </el-card>
        </div>
        <div class="main_box_right">
            <div class="flex items-center mb-8">
                <el-button type="primary" @click="addApiHandler">新增接口</el-button>
            </div>
            <el-table :data="dataPage.tableData" style="width: 100%">
                <el-table-column prop="apiUrl" label="接口路径" />
                <el-table-column prop="apiName" label="接口名称" />
                <el-table-column label="操作" width="140" align="right">
                    <template #default="scope">
                        <el-button type="primary" link @click="openAnnouncementDialog(scope.row)">版本更新</el-button>
                        <el-button type="primary" link @click="editApiHandler(scope.row)">编辑</el-button>
                        <el-button type="danger" link @click="deleteApiHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <AppFadeModel v-model="dataPage.showFlModel" title="API设置" :type="1" @refresh="initData"
        :nodeCurryInfo="dataPage.nodeCurryInfo" :curryInfo="dataPage.curryInfo"></AppFadeModel>
    <AppFilesEditModel v-model="dataPage.showAddModel" @refresh="getListByCateId"
        :nodeCurryInfo="dataPage.nodeCurryInfo" :curryInfo="dataPage.curryInfo">
    </AppFilesEditModel>
    <AnnouncementDialog v-model:visible="dataPage.showAnnouncementDialog" :curryInfo="dataPage.curryInfo"
        ref="announcementDialogRef"></AnnouncementDialog>
</template>
<style lang="scss" scoped>
.api_box_box {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: calc(100vh - 120px);
    width: 100%;

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        .node-title {
            max-width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .main_box_left {
        height: 100%;
        min-width: 350px;
        max-width: 450px;
        overflow: hidden;
        background-color: #fff;
        margin-right: 12px;

        ::v-deep(.el-card.is-always-shadow) {
            height: 100%;
        }
    }

    .main_box_right {
        padding: 8px;
        flex: 1;
        height: 100%;
        background-color: #fff;
    }
}
</style>