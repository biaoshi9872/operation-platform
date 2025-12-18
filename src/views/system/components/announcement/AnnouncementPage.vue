<script setup lang="ts">
defineOptions({ name: 'announcementList' })
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import announcement_api from '@/api/announcement'
import AnnouncementEditDialog from './AnnouncementEditDialog.vue'

const props = defineProps({
    curryInfo: {
        type: Object,
        default: () => { }
    },
    type: {
        type: String,
        default: '1'
    }
})
const dataPage: IPage<any, API.T_GongGaoFenYeChaXunListRecords> = reactive({
    isOnload: false,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {
        title: '',
        publisher: '',
        publishTimeStart: '',
        publishTimeEnd: ''
    },
    dataList: [],
    selectPage: announcement_api.A_page,
    delete: announcement_api.A_delete
})
const { searchQuery, deleteItem } = pageHooks(dataPage)

const getQueryParams = () => {
    const { page, facade } = dataPage
    let linkId = props.curryInfo?.id || 0
    return { ...page, ...facade, linkId }
}
const searchQueryHarder = () => {
    const obj = getQueryParams()
    searchQuery(obj)
}

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit' | 'detail'>('add')
const currentId = ref<number>(0)

const handleAdd = () => {
    dialogType.value = 'add'
    dialogVisible.value = true
}
const handleEdit = (row: any) => {
    dialogType.value = 'edit'
    currentId.value = row.id
    dialogVisible.value = true
}
const handleDetail = (row: any) => {
    dialogType.value = 'detail'
    currentId.value = row.id
    dialogVisible.value = true
}
const handleDelete = (row: any) => {
    deleteItem({ id: row.id, linkId: props.curryInfo?.id || 0 }, '提示', '确认是否删除该公告？')
}

defineExpose({
    init: searchQueryHarder
})

</script>
<template>
    <div class="main_box">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="标题">
                <el-input v-model.trim="dataPage.facade.title" placeholder="请输入标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="发布人">
                <el-input v-model.trim="dataPage.facade.publisher" placeholder="请输入发布人" clearable></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
                <DatePickerRange v-model:start="dataPage.facade.publishTimeStart" dateRangeType="datetimerange"
                    v-model:end="dataPage.facade.publishTimeEnd"></DatePickerRange>
            </el-form-item>
        </SearchForm>
        <div>
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" :dataPage="dataPage"
                :loading="dataPage.loadingData" @pagingQuery="searchQueryHarder">
                <template #option>
                    <el-button type="primary" @click="handleAdd">{{ type === '1' ? '新增公告' : '版本更新' }} </el-button>
                </template>
                <YbtTableColumn type="default" prop="id" label="ID" width="100"></YbtTableColumn>
                <YbtTableColumn type="default" prop="title" label="标题" min-width="200"></YbtTableColumn>
                <YbtTableColumn type="default" prop="publisher" label="发布人" width="160"></YbtTableColumn>
                <YbtTableColumn type="default" prop="publishTime" label="发布时间" width="180"></YbtTableColumn>
                <YbtTableColumn type="default" prop="updateDate" label="最后修改时间" width="180"></YbtTableColumn>
                <YbtTableColumn type="default" prop="" label="操作" width="240" fixed="right" align="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                        <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
                        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                    </template>
                </YbtTableColumn>
            </TableModel>
        </div>
        <AnnouncementEditDialog v-model:visible="dialogVisible" :type="dialogType" :id="currentId" :source="type"
            :linkId="props.curryInfo?.id" @success="searchQueryHarder" />
    </div>
</template>
<style lang="scss" scoped></style>
