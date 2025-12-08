<script setup lang="ts">
defineOptions({
    name: 'categoryProduct'
})
import { ElMessageBox, ElMessage } from 'element-plus'
//import { A_getCateInfoTree, A_getCateGoryInfo, A_deleteCateInfo } from '@/api/productCategory'
// import { formatStatus } from '@/utils/constant'
import ProductModal from './components/ProductModal.vue'

const treeRef = ref()
//树属性
const defaultProps = {
    children: 'childrenInfo',
    label: 'categoryName'
}

//分页
const pageData = ref({
    page: 1,
    limit: 9999,
    totalCount: 0
})

//loading
const tableLoading = ref(false)

//弹框显示
const productVisible = ref(false)
const attrVisible = ref(false)
const mappingVisible = ref(false)

//弹框需要的属性
const currentId = ref()
const currentCategoryCode = ref('')
const mappingData = ref<API.GetMappingChannelData[]>([])

//数据
const treeData = ref<API.GetTreeCateInfoData[]>([])
const tableData = ref<API.GetCateGoryInfoData[]>([])
// const expandedKeys = ref<number[]>([])

onMounted(() => {
    fetchTreeCateInfo()
})

async function fetchTreeCateInfo() {
    treeData.value = await A_getCateInfoTree()
}

async function fetchList(data: API.GetCateGoryInfoParams) {
    try {
        tableLoading.value = true
        const { categoryCode, level, searchParentFlag, searchMappingFlag } = data
        tableData.value = await A_getCateGoryInfo({ categoryCode, level, searchParentFlag, searchMappingFlag })
    } finally {
        tableLoading.value = false
    }
}

function handleAdd() {
    currentId.value = undefined
    productVisible.value = true
}

function handleEdit(id: number) {
    currentId.value = id
    productVisible.value = true
}

function handleTreeNodeClick(data: API.GetTreeCateInfoData) {
    const { categoryCode, level } = data
    fetchList({ categoryCode, level, searchParentFlag: true, searchMappingFlag: true })
}

async function updatePage(isUpdateTree: Boolean) {
    let id: number | undefined = undefined
    if (treeRef.value.treeRef.getCurrentNode()) {
        const { categoryCode, level } = treeRef.value.treeRef.getCurrentNode()
        id = treeRef.value.treeRef.getCurrentNode().id
        fetchList({ categoryCode, level, searchParentFlag: true, searchMappingFlag: true })
    }
    if (isUpdateTree) {
        await fetchTreeCateInfo()
        if (id) {
            treeRef.value.treeRef.setCurrentKey(id)
        }
    } else {
        currentId.value = undefined
        currentCategoryCode.value = ''
        mappingData.value = []
    }
}
</script>

<template>
    <PageContainer>
        <el-container>
            <el-aside class="w-200 border-rd-2 common-bg p-6 flex flex-col">
                <div class="option_container">
                    <AuthButton authKey="VO_CATEGORY_ADD" type="primary" size="small" @click="handleAdd()">新增
                    </AuthButton>
                </div>
                <Tree ref="treeRef" :data="treeData" :props="defaultProps" node-key="id" :expand-on-click-node="false"
                    @node-click="handleTreeNodeClick" :highlight-current="true" />
            </el-aside>
            <el-main class="pt-0">
                <TableModel :page="pageData" :listTableData="tableData" :isShowPagination="false"
                    v-loading="tableLoading">
                    <El-table-column prop="categoryCode" label="类目编号" mix-width="80" />
                    <El-table-column label="图片" width="80">
                        <template #default="{ row }">
                            <el-image style="height: 47px" :src="row.categoryPicUrl" v-if="row.categoryPicUrl"
                                :preview-src-list="[row.categoryPicUrl]" fit="cover" />
                            <span v-else>-</span>
                        </template>
                    </El-table-column>
                    <El-table-column prop="categoryName" label="类目名称" mix-width="100" />
                    <El-table-column label="父类目编号" mix-width="100">
                        <template #default="{ row }">
                            <span>{{ row.parentCode === '0' ? '-' : row.parentCode }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="父类目名称" mix-width="100">
                        <template #default="{ row }">
                            <span>{{ row.parentCategoryName || '-' }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="渠道分类">
                        <template #default="{ row }">
                            <div v-if="row.mappingChannelList">
                                <div v-for="item in row.mappingChannelList" :key="item.source" class="channelItem">
                                    <el-tooltip effect="dark" :content="item.categoryName">{{ item.categoryName
                                    }}</el-tooltip>
                                </div>
                            </div>
                            <div v-else>-</div>
                        </template>
                    </El-table-column>
                    <El-table-column prop="level" label="类目层级" mix-width="80" />
                    <El-table-column label="状态" width="60">
                        <template #default="{ row }">
                            <!-- <span>{{ formatStatus(row.stateEnum) }}</span> -->
                        </template>
                    </El-table-column>
                    <El-table-column prop="sort" label="排序" width="60" />
                    <El-table-column label="备注" mix-width="100" show-overflow-tooltip>
                        <template #default="{ row }">
                            <span>{{ row.remarks || '-' }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="操作" fixed="right" width="180" align="right">
                        <template #default="{ row, $index }">
                            <AuthButton authKey="VO_CATEGORY_EDIT" type="primary" link @click="handleEdit(row.id)">编辑
                            </AuthButton>
                        </template>
                    </El-table-column>
                </TableModel>
            </el-main>
            <ProductModal v-model="productVisible" :id="currentId" @update="updatePage(true)" />
        </el-container>
    </PageContainer>
</template>

<style lang="scss" scoped>
.option_container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 8px;
}

.channelItem {
    @include overflow(1);
}

:deep(.el-table__cell) {
    position: static;
}
</style>
