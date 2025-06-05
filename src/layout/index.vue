<script setup lang="ts">
import { tabsStore, useAppStore, useRouterStore, useUserStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
import MenuItem from './Menu/MenuItem.vue'
import TopBar from './TopBar/index.vue'
import ViewTags from './ViewTags/index.vue'

const useUserStoreInfo = useUserStore()
const $routerStore = useRouterStore()
const $route = useRoute()
defineOptions({ name: 'Layout' })

const $appStore = useAppStore()

const $tabsStore = tabsStore()

const { cachedViews }: any = storeToRefs($tabsStore)

const menuRoutes = computed(() => {
  return $routerStore.menuRoutes
})
const defaultActive = computed(() => {
  const { path } = $route
  return path
})

const curryRoute = computed(() => {
  return $route.meta
})

const isCollapse = ref(false)

watch(isCollapse, () => {
  resizeHandler()
})

let slaterTableWidth = ref('0px')
let slaterTableResizeHandlerId: any = null

const resizeHandler = () => {
  let width = window.innerWidth
  slaterTableWidth.value = `${width - (isCollapse.value ? 60 : 160)}px`
  return resizeHandler
}
let showRemind = ref(false)
onMounted(() => {
  slaterTableResizeHandlerId = resizeHandler()
  window.addEventListener('resize', slaterTableResizeHandlerId)
})

onUnmounted(() => {
  window.removeEventListener('resize', slaterTableResizeHandlerId)
})

let NoNavigationList = ['/commodity/added/index', '/commodity/edit/index', '/sys/pptGenerate/index']
const showNavigation = computed(() => {
  console.log($route.path)
  if (NoNavigationList.includes($route.path)) return false
  else return true
})

//滚动重置
const pageRef = ref(null) as any
const rollingReset = (position: number = 0) => {
  if (pageRef.value && 'scrollBehavior' in document.documentElement.style) {
    // 检查浏览器是否支持 smooth 滚动
    pageRef.value.scrollTo({
      top: position,
      behavior: 'smooth' // 添加平滑滚动效果
    })
  } else {
    pageRef.value.scrollTop = position
  }
}

provide('rollingReset', rollingReset)
</script>

<template>
  <el-container class="layout-wrapper">
    <el-header class="layout-header" height="56px">
      <div class="logo-wrap">
        <span @click="isCollapse = !isCollapse">
          <svg-icon :name="isCollapse ? 'packUp' : 'fold'"></svg-icon>
        </span>
        <img src="@/assets/images/logo.png" class="logo-img" />
        <span class="menu_text">供应链开放平台 </span>
      </div>
      <TopBar />
    </el-header>
    <el-container v-if="showNavigation" class="layout-container">
      <div class="layout-sidebar sidebar-dark" :style="{ width: isCollapse ? '60px' : '190px' }">
        <el-menu mode="vertical" :default-active="defaultActive" :collapse="isCollapse" :collapse-transition="false">
          <menu-item v-for="menu in menuRoutes" :key="menu.path" :menu="menu"></menu-item>
        </el-menu>
      </div>
      <div class="main-wrapper"
        :style="{ maxWidth: !showNavigation ? '100vw' : isCollapse ? 'calc(100vw - 70px)' : 'calc(100vw - 180px)' }">
        <div class="view_tags_container">
          <ViewTags />
        </div>
        <div class="router_container" ref="pageRef">
          <router-view v-slot="{ Component, route }">
            <keep-alive :include="[...cachedViews]">
              <component :is="Component" :key="route.name" class="overflow-hidden" />
            </keep-alive>
          </router-view>
        </div>
      </div>
    </el-container>
    <el-container v-else class="layout-container" ref="pageRef">
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="[...cachedViews]">
          <component :is="Component" :key="route.name" class="overflow-hidden" />
        </keep-alive>
      </router-view>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-wrapper {
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .logo-wrap {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      height: 76%;
    }

    .menu_text {
      font-size: 18px;
      transform: skewX(-10deg);
      font-weight: bold;
      background-image: linear-gradient(to right, var(--el-color-primary-light-5), var(--el-color-primary));
      color: transparent;
      -webkit-background-clip: text;
    }
  }

  .layout-header {
    @include flex('between');
    // position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background: var(--theme-common-bg-color);
  }

  .layout-container {
    height: calc(100vh - 56px);
    background: var(--el-color-primary-light-9);
    display: flex;
  }

  .layout-sidebar {
    height: 100%;
    width: 170px;
    border-right: var(--theme-border-color-light) 1px solid;
    background-color: var(--theme-common-bg-color);
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

    ::-webkit-scrollbar {
      width: 0 !important;
      display: none !important;
    }

    ::-moz-scrollbar {
      width: 0 !important;
      display: none !important;
    }
  }

  .layout-sidebar::-webkit-scrollbar {
    width: 0 !important;
    display: none !important;
  }

  .layout-sidebar::-moz-scrollbar {
    width: 0 !important;
    display: none !important;
  }

  .main-wrapper {
    height: calc(100vh - 56px);
    width: 100%;

    .router_container {
      width: 100%;
      max-height: calc(100% - 48px);
      padding: 4px 0 2px 4px;
      overflow: auto;
    }
  }
}
</style>
