<script setup lang="ts" name="roleSet">
defineOptions({
  name: 'menu'
})
import MenuEdit from './components/MenuEdit.vue'
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import type { TabsPaneContext } from 'element-plus'
import menu_api from '@/api/system/menu'
import { ElMessageBox ,ElMessage} from 'element-plus'
const curMenu = ref<any| null>()
const isAdd = ref<boolean>(false)
const dataPage: IPage<any, any> = reactive({
  selectPage: menu_api.A_menuManageTree,
  showEdit: false,
  isOnload: true,
  dataList: [],
  facade: {
    menuName: ''
  },
  facadeKz: {
    menuType: '1'
  }
})

const { facade, dataList, showEdit } = toRefs(dataPage)
const { searchQuery } = pageHooks(dataPage)

function handleAdd(type: '1' | '2', row: any | null) {
  curMenu.value = type === '1' ? null : row
  isAdd.value = true
  dataPage.showEdit = true
}
function handleEdit(row: any) {
  curMenu.value = row
  isAdd.value = false
  dataPage.showEdit = true
}

// 删除
 function handleDelete({ id }: { id: number }) {
  ElMessageBox.confirm(
  `请确认是否删除菜单?`,
  '警告',
    {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }
  )
  .then(() => {
    menu_api.A_menuDelete(id).then(res => {
      ElMessage.success(`删除成功!`)
      searchQueryHandler()
    })
  })
}

/**查询参数 */
const getQueryParams = () => {
  const { facade, facadeKz } = dataPage
  return { ...facade, ...facadeKz }
}

// 查询回调
const searchQueryHandler = () => {
  const obj = getQueryParams()
  searchQuery(obj)
}

const handleContextMenu = (row: any, column: any, event: Event) => {
  console.log(row, column, event)
}

function handleTab(tab: TabsPaneContext, event: Event) {
  searchQueryHandler()
}
</script>

<template>
  <PageContainer v-loading="dataPage.loadingData" class="menu_container">
    <SearchForm v-model:model="facade" :tabIndex="dataPage.facadeKz.menuType" class="el-search-item" @search="searchQueryHandler">
      <template #tabs>
        <el-tabs v-model.trim="dataPage.facadeKz.menuType" class="demo-tabs" @tab-change="handleTab">
          <el-tab-pane label="顶级机构" name="1"></el-tab-pane>
          <el-tab-pane label="分支机构" name="2"></el-tab-pane>
          <el-tab-pane label="应用" name="3"></el-tab-pane>
        </el-tabs>
      </template>
      <el-form-item label="菜单名称">
        <el-input v-model="facade.menuName" placeholder="请输菜单名称" clearable />
      </el-form-item>
      <template #button>
        <el-button authKey="VO_MEUN_ADD" type="primary" @click="handleAdd('1', null)">新增分组</el-button>
      </template>
    </SearchForm>
    <TableModel
      :listTableData="dataList"
      row-key="id"
      :tree-props="{ children: 'children' }"
      @rowContextmenu="handleContextMenu"
      :isShowPagination="false"
    >
      <YbtTableColumn prop="name" label="名称" min-width="200"></YbtTableColumn>
      <YbtTableColumn prop="id" label="auth"></YbtTableColumn>
      <YbtTableColumn prop="level" label="类型">
        <template #default="scope">
          <el-tag v-if="scope.row.level == 1" type="info">菜单</el-tag>
          <el-tag v-if="scope.row.level == 2" type="success">按钮</el-tag>
          <el-tag v-if="scope.row.level == 3" type="warning">分组</el-tag>
        </template>
      </YbtTableColumn>
      <YbtTableColumn prop="sort" label="排序"></YbtTableColumn>
      <YbtTableColumn prop="url" label="路由" width="200" show-overflow-tooltip></YbtTableColumn>
      <YbtTableColumn prop="perms" label="授权标识" width="200" show-overflow-tooltip></YbtTableColumn>
      <YbtTableColumn prop="icon" label="菜单图标" width="150"></YbtTableColumn>
      <YbtTableColumn prop="status" label="隐藏菜单">
        <template #default="{ row: { status } }">
          <el-tag :type="status === 1 ? 'success' : 'danger'">{{ status === 1 ? '否' : '是' }}</el-tag>
        </template>
      </YbtTableColumn>
      <YbtTableColumn label="操作" fixed="right" align="right" width="200">
        <template #default="{ row }">
          <el-button authKey="VO_MEUN_ADDUP" type="text" @click="handleAdd('2', row)" v-if="row.level !== 2">新增下级</el-button>
          <el-button authKey="VO_MEUN_EDIT" type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button authKey="VO_MEUN_DELETE" type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </YbtTableColumn>
    </TableModel>
  </PageContainer>
  <MenuEdit v-model="showEdit" :is-add="isAdd" @update="searchQueryHandler" :current="curMenu" :menuType="dataPage.facadeKz.menuType"></MenuEdit>
</template>

<style lang="scss" scoped>
.menu_container {
  position: relative;
}
</style>
