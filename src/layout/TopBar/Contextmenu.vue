
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { tabsStore, useRouterStore } from '@/stores/index'
import { ClickOutside as vClickOutside } from 'element-plus'
const $tabsStore = tabsStore()
import { ArrowDown, Close, CircleClose, CircleCloseFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
interface IProp {
  visible: boolean //是否显示
  curryTab: any
  contextMenuStyle: {
    left: number
    top: number
  }
}
const emits = defineEmits<{
  (e: 'update:visible', value: any): void
}>()

const props = withDefaults(defineProps<IProp>(), {
  visible: false,
  contextMenuStyle: () => {
    return { top: 0, left: 0 }
  }
})

// dropdown 关闭事件
const onClose = (type: string) => {
  switch (type) {
    case 'close':
      $tabsStore.closeTab(router, props.curryTab)
      break
    case 'closeLeft':
      $tabsStore.closeLeftTabs(router, props.curryTab)
      break
    case 'closeRight':
      $tabsStore.closeRightTabs(router, props.curryTab)
      break
    case 'closeOthers':
      $tabsStore.closeOthersTabs(router, props.curryTab)
      break
    case 'closeAll':
      $tabsStore.closeAllTabs(router, route)
      break
  }
}

///刷新页面
const refreshSelectedTag = () => {
  location.reload()
  emits('update:visible', false)
}
//关闭当前页面
const closeSelectedTag = () => {
  onClose('close')
  emits('update:visible', false)
}
//关闭其它
const closeOthersTags = () => {
  onClose('closeOthers')
  emits('update:visible', false)
}
//关闭左侧
const closeLeftTags = () => {
  onClose('closeLeft')
  emits('update:visible', false)
}
//关闭右侧
const closeRightTags = () => {
  onClose('closeRight')
  emits('update:visible', false)
}
//关闭所有
const closeAllTags = () => {
  onClose('closeAll')
  emits('update:visible', false)
}
</script>
<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
    :style="{ left: contextMenuStyle.left + 'px', top: contextMenuStyle.top + 'px' }"
  >
    <ul v-show="visible" class="contextmenu">
      <li @click="refreshSelectedTag">
        <refresh-right style="width: 1em; height: 1em;" />刷新页面
      </li>
      <li @click="closeSelectedTag">
        <close style="width: 1em; height: 1em;" />关闭当前
      </li>
      <li @click="closeOthersTags">
        <circle-close style="width: 1em; height: 1em;" />关闭其他
      </li>
      <li @click="closeLeftTags">
        <back style="width: 1em; height: 1em;" />关闭左侧
      </li>
      <li @click="closeRightTags">
        <right style="width: 1em; height: 1em;" />关闭右侧
      </li>
      <li @click="closeAllTags">
        <circle-close style="width: 1em; height: 1em;" />全部关闭
      </li>
    </ul>
  </div>
</template>
  
<style lang="scss" scoped>
.tags-view-container {
  position: absolute;
  width: 500px;
  .contextmenu {
    margin: 0;
    background: var(--el-bg-color-overlay, #fff);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: var(--tags-item-text, #333);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    border: 1px solid var(--el-border-color-light, #e4e7ed);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 2px;
      &:hover {
        background: var(--tags-item-hover, #eee);
      }
    }
  }
}
</style>
 
 
