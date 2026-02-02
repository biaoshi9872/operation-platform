<script setup lang="ts">
defineOptions({
    name: 'categoryProduct'
})
import virtualCardPackProduct_api from '@/api/virtualCardPackProduct'
import ProductModal from './components/ProductModal.vue'

const treeRef = ref()
//树属性
const defaultProps = {
    children: 'children',
    label: 'label'
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
//弹框需要的属性
const currentId = ref()
const curryInfo = ref<API.GetCateGoryInfoData>()
const currentCategoryCode = ref('')
const mappingData = ref<API.GetMappingChannelData[]>([])

//数据
const treeData = ref<any[]>([])
const tableData = ref<API.GetCateGoryInfoData[]>([])
// const expandedKeys = ref<number[]>([])

onMounted(() => {
    fetchTreeCateInfo()
})

async function fetchTreeCateInfo() {
    const res = await virtualCardPackProduct_api.A_cateTree({})
    treeData.value = res
}

async function fetchList(data: API.GetCateGoryInfoParams) {
    try {
        tableLoading.value = true
        const { categoryCode, level, searchParentFlag, searchMappingFlag } = data
        tableData.value = await virtualCardPackProduct_api.A_listUpCate({ categoryCode, level, searchParentFlag, searchMappingFlag })
    } finally {
        tableLoading.value = false
    }
}

function handleAdd() {
    currentId.value = undefined
    productVisible.value = true
}

function handleEdit(row: any) {
    currentId.value = row.id
    curryInfo.value = row
    productVisible.value = true
}

function handleTreeNodeClick(data: API.GetTreeCateInfoData) {
    const { categoryCode, value, level } = data as any
    fetchList({ categoryCode: value, level, searchParentFlag: true, searchMappingFlag: true })
}

async function updatePage(isUpdateTree: Boolean) {
    let id: number | undefined = undefined
    if (treeRef.value.getCurrentNode()) {
        const cur = treeRef.value.getCurrentNode()
        const { value: categoryCode, level } = cur
        id = cur.value
        fetchList({ categoryCode, level, searchParentFlag: true, searchMappingFlag: true })
    }
    if (isUpdateTree) {
        await fetchTreeCateInfo()
        if (id) {
            treeRef.value.setCurrentKey(id)
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
                <el-tree ref="treeRef" :data="treeData" :props="defaultProps" node-key="value"
                    :expand-on-click-node="false" @node-click="handleTreeNodeClick" :highlight-current="true" />
            </el-aside>
            <el-main class="pt-0">
                <TableModel :page="pageData" :listTableData="tableData" :isShowPagination="false"
                    v-loading="tableLoading">
                    <El-table-column prop="categoryCode" label="类目编号" min-width="80" />
                    <El-table-column prop="categoryName" label="类目名称" min-width="100" />
                    <El-table-column label="父类目编号" min-width="100">
                        <template #default="{ row }">
                            <span>{{ row.parentCode === '0' ? '-' : row.parentCode }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="父类目名称" min-width="100">
                        <template #default="{ row }">
                            <span>{{ row.parentName || '-' }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="状态" width="60">
                        <template #default="{ row }">
                            {{ row.stateEnum === 1 ? '启用' : '禁用' }}
                        </template>
                    </El-table-column>
                    <El-table-column label="操作" fixed="right" width="180" align="right">
                        <template #default="{ row, $index }">
                            <AuthButton authKey="VO_CATEGORY_EDIT" type="primary" link @click="handleEdit(row)">编辑
                            </AuthButton>
                        </template>
                    </El-table-column>
                </TableModel>
            </el-main>
            <ProductModal v-model="productVisible" :id="currentId" :curryInfo="curryInfo" @update="updatePage(true)" />
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
