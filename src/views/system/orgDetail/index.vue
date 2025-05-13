<script setup lang="ts">
import menu_api from '@/api/system/menu'
const dataPage = reactive({
  showApplication: false,
  curryInfo: null,
  facade: {
    usernameOrPhone: '',
    roleId: '',
    status: '',
    page: 1,
    pageSize: 10
  },
  page: {},
  tree: [],
  activeName: 'first'
})

onMounted(() => {
  getAllAutoTreeList().then((res: any) => {
    dataPage.tree = res
  })
})
function getAllAutoTreeList() {
  const menuType = 1
  return menu_api.A_menuManageTree({ menuType, menuName: '' })
}
</script>
<template>
  <PageContainer class="main_box">
    <el-tabs v-model="dataPage.activeName" class="demo-tabs">
      <el-tab-pane label="用户" name="first"></el-tab-pane>
      <el-tab-pane label="角色" name="second"></el-tab-pane>
    </el-tabs>
    <!-- 用户 -->
    <div v-if="dataPage.activeName === 'first'">
      <SearchForm v-model:model="dataPage.facade">
        <el-form-item label="账号/手机号" title="账号/手机号">
          <el-input v-model="dataPage.facade.usernameOrPhone" placeholder="请输入账号/手机号" clearable />
        </el-form-item>
      </SearchForm>
      <div class="main_box_left">
        <div>用户名称：xxx</div>
        <div>角色：xxx</div>
        <div>
          <el-button type="primary" link>快速权限设置</el-button>
        </div>
      </div>
      <div class="main_box_right">
        <div class="main_box_right_left">
          <el-card shadow="hover">
            <template #header>全部权限</template>
            <el-tree
              ref="leftTree"
              :data="dataPage.tree"
              show-checkbox
              highlight-current
              node-key="id"
              :props="{ children: 'children', label: 'name' ,disabled:'disabled'}"
              default-expand-all="true"
            />
          </el-card>
          <el-card title="已有权限" shadow="hover">
            <template #header>已有权限</template>
            <el-tree
              ref="leftTree"
              :data="dataPage.tree"
              show-checkbox
              highlight-current
              node-key="id"
              :props="{ children: 'children', label: 'name' ,disabled:'disabled'}"
              default-expand-all="true"
            />
          </el-card>
          <el-card title="未有权限" shadow="hover">
            <template #header>未有权限</template>
            <el-tree
              ref="leftTree"
              :data="dataPage.tree"
              show-checkbox
              highlight-current
              node-key="id"
              :props="{ children: 'children', label: 'name' ,disabled:'disabled'}"
              default-expand-all="true"
            />
          </el-card>
        </div>
        <div>
          <el-table>
            <el-table-column prop="id" label="操作人"></el-table-column>
            <el-table-column prop="id" label="操作时间"></el-table-column>
            <el-table-column prop="id" label="操作详情"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 角色 -->
    <div v-if="dataPage.activeName == 'second'">
      <SearchForm v-model:model="dataPage.facade">
        <el-form-item label="角色" title="角色">
          <el-input v-model="dataPage.facade.usernameOrPhone" placeholder="请输入账号/手机号" clearable />
        </el-form-item>
      </SearchForm>
      <div class="main_box_left">
        <div>角色：xxx</div>
        <div>
          <el-button type="primary" link>快速权限设置</el-button>
        </div>
      </div>
      <div class="main_box_right">
        <div class="main_box_right_left">
          <el-card shadow="hover">
            <template #header>全部权限</template>
            <el-tree
              ref="leftTree"
              :data="dataPage.tree"
              show-checkbox
              highlight-current
              node-key="id"
              :props="{ children: 'children', label: 'name' ,disabled:'disabled'}"
              default-expand-all="true"
            />
          </el-card>
          <el-card title="已有权限" shadow="hover">
            <template #header>已有权限</template>
            <el-tree
              ref="leftTree"
              :data="dataPage.tree"
              show-checkbox
              highlight-current
              node-key="id"
              :props="{ children: 'children', label: 'name' ,disabled:'disabled'}"
              default-expand-all="true"
            />
          </el-card>
          <el-card title="未有权限" shadow="hover">
            <template #header>未有权限</template>
            <el-tree
              ref="leftTree"
              :data="dataPage.tree"
              show-checkbox
              highlight-current
              node-key="id"
              :props="{ children: 'children', label: 'name' ,disabled:'disabled'}"
              default-expand-all="true"
            />
          </el-card>
        </div>
        <div>
          <el-table>
            <el-table-column prop="id" label="操作人"></el-table-column>
            <el-table-column prop="id" label="操作时间"></el-table-column>
            <el-table-column prop="id" label="操作详情"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </PageContainer>
</template>
<style lang="scss" scoped>
.main_box {
  padding: 20px;
  background-color: #fff;
  .main_box_left {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-start;
    padding: 12px;
  }
  .main_box_right {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px;
    .main_box_right_left {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
  }
}
</style>