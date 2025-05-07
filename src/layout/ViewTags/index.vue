<template>
  <div class="tabs-container">
    <div class="tabs-item">
      <el-tabs v-model="activeTabName" class="tabs-item-style" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane v-for="tab in $tabsStore.visitedViews" :key="tab" :label="tab.title" :name="tab.pathKey" :closable="!isAffix(tab)">
          <template #label>
            <span class="tab-label" @contextmenu="tabContextmenu($event, tab)">
              <span class="tab-title">{{ tab.title }}</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dropdown class="tabs-action" trigger="click" placement="bottom-end" @command="onClose">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="Close" command="close">关闭</el-dropdown-item>
          <el-dropdown-item :icon="CircleClose" command="closeOthers">关闭其他</el-dropdown-item>
          <el-dropdown-item :icon="CircleCloseFilled" command="closeAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
      <el-icon>
        <arrow-down />
      </el-icon>
    </el-dropdown>
  </div>
  <Contextmenu v-model:visible="showContextMenu" :contextMenuStyle="contextMenuStyle" :curryTab="curryTab"></Contextmenu>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tabsStore, useRouterStore } from '@/stores/index'
import Contextmenu from '../TopBar/Contextmenu.vue'

const $tabsStore = tabsStore()
const $routerStore = useRouterStore()

import { ArrowDown, Close, CircleClose, CircleCloseFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const showContextMenu = ref(false)
const contextMenuStyle = reactive({
  left: 0,
  top: 0
})
const activeTabName = ref(route.path)
const curryTab = ref(null)
//右键菜单信息
const tabContextmenu = ($event: MouseEvent, tabsItem: any) => {
  //位置计算
  const { clientX, clientY } = $event
  contextMenuStyle.left = clientX
  contextMenuStyle.top = clientY
  showContextMenu.value = true
  curryTab.value = tabsItem
  $event.preventDefault()
}
const outsideClick = (tab: any) => {
  showContextMenu.value = false
}
// 是否固定
const isAffix = (tab: any) => {
  return tab.meta?.affix
}

watch(route, () => {
  // 当前路由，新增到tabs里
  if (route.name) {
    addTab()
  }
})

onMounted(() => {
  // 初始化
})

// 初始化固定tab
const initTabs = () => {
  const affixTabs = getAffixTabs($routerStore.routes)
  for (const tab of affixTabs) {
    // 需要有tab名称
    if (tab.name) {
      $tabsStore.addView(tab)
    }
  }
}

// 获取需要固定的tabs
const getAffixTabs = (routes: any) => {
  let tabs: any[] = []
  routes.forEach((route: any) => {
    if (route.meta?.affix) {
      tabs.push({
        fullPath: route.path,
        path: route.path,
        name: route.name,
        meta: { ...route.meta },
        query: { ...route.query }
      })
    }
    if (route.children) {
      const tempTabs = getAffixTabs(route.children)
      if (tempTabs.length >= 1) {
        tabs = [...tabs, ...tempTabs]
      }
    }
  })
  return tabs
}

// 新增tab
const addTab = () => {
  $tabsStore.addView(route)
  $tabsStore.addCachedView(route)
  activeTabName.value = route.meta.openType == 2 ? route.path + '_' + JSON.stringify(route.query) : route.path
}

// tab被选中
const tabClick = (tab: any) => {
  const tabMenu = $tabsStore.visitedViews.find((tabs: any) => tabs.pathKey === tab.props.name)
  if (tab.props.name) {
    //打开新页签
    if (tabMenu?.meta?.openType == 2) {
      const pathInfo = JSON.stringify({
        path: tabMenu.path,
        query: {
          ...tabMenu.query
        }
      })
      router.push({
        path: '/middlePage',
        query: { pathInfo }
      })
    } else {
      router.push({
        path: tabMenu.path,
        query: {
          ...tabMenu.query
        }
      })
    }
  }
}

// 点击关闭tab
const tabRemove = (path: string) => {
  const tab = $tabsStore.visitedViews.filter((tab: any) => tab.pathKey === path)
  $tabsStore.closeTab(router, tab[0])
}

// dropdown 关闭事件
const onClose = (type: string) => {
  switch (type) {
    case 'close':
      $tabsStore.closeTab(router, route)
      break
    case 'closeOthers':
      $tabsStore.closeOthersTabs(router, route)
      break
    case 'closeAll':
      $tabsStore.closeAllTabs(router, route)
      break
  }
}

//初始化
initTabs()
addTab()
</script>

<style lang="scss" scoped>
.tabs-container {
  display: flex;
  position: relative;
  z-index: 6;
  height: 40px;
  background-color: var(--el-searchForm-bg-color);
  //margin-bottom: 8px;

  .tabs-item {
    transition: left 0.3s;
    flex-grow: 1;
    overflow: hidden;

    ::v-deep(.el-tabs__nav-prev) {
      padding: 0 10px;
      border-right: var(--el-border-color-extra-light) 1px solid;
    }

    ::v-deep(.el-tabs__nav-next) {
      padding: 0 10px;
      border-left: var(--el-border-color-extra-light) 1px solid;
    }

    ::v-deep(.is-scrollable) {
      padding: 0 32px;
    }

    ::v-deep(.el-tabs__active-bar) {
      height: 0;
    }

    ::v-deep(.el-tabs__item) {
      .is-icon-close {
        transition: none !important;

        &:hover {
          color: var(--el-color-primary-light-9);
          background-color: var(--el-color-primary);
          border-radius: 50%;
        }
      }
    }

    .tab-item-content {
      position: relative;
    }
  }
}

.tabs-item-style {
  ::v-deep(.el-tabs__item) {
    padding: 0 15px !important;
    border-right: var(--el-border-color-extra-light) 1px solid;
    user-select: none;
    color: #8c8c8c;
    background-color: var(--el-searchForm-bg-color);

    &:hover {
      color: #444;
      background: rgba(0, 0, 0, 0.02);
    }

    &.is-active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);

      &::before {
        background-color: var(--el-color-primary);
      }
    }

    &::before {
      content: '';
      width: 9px;
      height: 9px;
      margin-right: 8px;
      display: inline-block;
      background-color: #ddd;
      border-radius: 50%;
    }
  }
}

.tabs-action {
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  padding: 0 12px;
  align-items: center;
  cursor: pointer;
  color: #666;
  border-left: var(--el-border-color-extra-light) 1px solid;
}
</style>
