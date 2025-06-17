<template>
  <template v-if="menu.children.length > 0">
    <el-sub-menu :index="menu.path" v-if="hideMenu(menu.children)">
      <template #title>
        <div class="iconfont" :class="menu.meta.icon"></div>
        <span>{{ menu.meta.title }}</span>
      </template>
      <menu-item v-for="sub in menu.children" :key="sub.path" :menu="sub" v-show="!sub.hidden"></menu-item>
    </el-sub-menu>
  </template>
  <el-menu-item :index="menu.path" v-else @click="handleClickMenu(menu)" :class="menu.path == '/home' ? 'home' : ''">
    <svg-icon class="route-icon mr-10" :name="menu.meta.icon" v-if="menu.meta.icon" />
    <template #title>
      <span :title="menu.meta.title" class="title">{{ menu.meta.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/index'
import { computed, PropType } from 'vue'
import { useRouter } from 'vue-router'
const $appStore = useAppStore()
defineProps({
  menu: {
    type: Object as PropType<any>,
    required: false
  }
})

const router = useRouter()

// 菜单点击事件
const handleClickMenu = (menu: any) => {
  if (menu?.meta?.openType == 3) {
    const url = router.resolve({
      path: menu.path,
      query: {
        ...menu.query
      }
    })
    window.open(url.href)
  } else {
    router.push(menu.path)
  }
}

const hideMenu = computed(() => {
  return function (children: any) {
    if (!children) return false
    return children.some((item: any) => {
      return !item.hidden
    })
  }
})
</script>

<style lang="scss" scoped>
.home {
  padding-left: 20px !important;
}

.iconfont {
  margin-right: 4px;
}

.route-icon {
  //width: 1px;
  font-size: 16px;
  flex-shrink: 0;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
