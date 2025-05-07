<!--
 * @Descripttion:查询包裹组件--- 重置查询功能统一
 * @version: 
 * @Author: biao.shi
 * @Date: 2022-06-13 18:54:45
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-21 09:25:27
-->
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

defineOptions({ name: 'SearchForm' })
import { cloneDeep, debounce } from 'lodash-es'
const props = defineProps({
  model: {
    type: Object,
    default: () => {}
  },
  customReset: {
    type: Boolean,
    default: false
  },
  noReSetKeys: {
    type: Array,
    default: () => []
  },
  tabIndex: {
    type: String,
    default: ''
  },
  topRadius: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:model', 'search', 'reset', 'update:currentPage'])

const slot = useSlots()
const pageInfo: any = inject('pageInfo', () => {
  return null
})
const attrs = useAttrs()
const fold = ref(true)
const contentHeight = ref(0)
const initialOption = ref({})
const { proxy } = getCurrentInstance() as any
const canFold = computed(() => {
  return contentHeight.value >= 100
})
const containerStyle = computed(() => {
  if (canFold && contentHeight.value) {
    return fold.value
      ? {
          height: '68px'
        }
      : {
          height: `auto`
        }
  } else {
    return {}
  }
})
const onResize = debounce(() => {
  nextTick(() => {
    computedHeight()
  })
}, 100)

onMounted(() => {
  computedHeight()
  let resetObj = cloneDeep(props.model)
  if (props.noReSetKeys?.length) {
    props.noReSetKeys.forEach((key: any) => {
      delete resetObj[key]
    })
  }
  initialOption.value = resetObj
  window.addEventListener('resize', onResize, false)
})
onActivated(() => {
  // 取消窗口缩放监听
  window.removeEventListener('resize', onResize, false)
})
onDeactivated(() => {
  window.removeEventListener('resize', onResize, false)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize, false)
})
const handleSearch = () => {
  emit('update:currentPage', 1)
  emit('search')
}
const handleReset = () => {
  //自定重置
  if (props.customReset) {
    emit('reset')
  } else {
    let resetObj = cloneDeep(initialOption.value) as any
    if (props.noReSetKeys?.length) {
      props.noReSetKeys.forEach((key: any) => {
        resetObj[key] = props.model[key]
      })
    }
    emit('update:model', resetObj)
    emit('reset')
  }
  nextTick(() => {
    emit('update:currentPage', 1)
    emit('search')
  })
}
watch(fold, () => {
  nextTick(() => {
    computedHeight()
  })
})

watch(
  () => props.tabIndex,
  () => {
    nextTick(() => {
      fold.value = true
      computedHeight()
    })
  }
)
const computedHeight = () => {
  contentHeight.value = proxy.$refs.content?.offsetHeight || 0
  computeSearchContainerHeight()
}

const searchRef: any = ref(null)
const computeSearchContainerHeight = () => {
  nextTick(() => {
    if (pageInfo) {
      pageInfo.searchHight = searchRef.value.clientHeight || '68'
      //是否插槽使用tabs
      if (slot.hasOwnProperty('tabs') || props.topRadius) {
        pageInfo.tabsHight = 0
      }
    }
  })
  console.log(pageInfo.searchHight, 'searchRef.value.clientHeight')
}

//计算容器高度
watch(
  [canFold, fold],
  () => {
    nextTick(() => {
      computeSearchContainerHeight()
    })
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="search-container common-shadow" ref="searchRef" :class="topRadius ? 'top-radius' : ''">
    <div class="tabs_container">
      <slot name="tabs"></slot>
    </div>
    <div class="_search-form-wrap" :style="containerStyle">
      <el-form v-bind="attrs" class="_search-form" :inline="true">
        <div class="form-item-content" ref="content">
          <slot />
          <div v-if="!fold" class="el-search-botton-wrap">
            <el-button :loading="loading" type="primary" @click="handleSearch">搜索</el-button>
            <el-button :loading="loading" @click="handleReset" class="mr-8">重置</el-button>
            <slot name="button" />
            <el-button v-if="canFold" type="primary" link @click="fold = true">收起</el-button>
          </div>
        </div>
      </el-form>
      <!-- 收起状态时 -->
      <div v-if="fold" class="one-line-botton">
        <el-button :loading="loading" type="primary" @click="handleSearch">搜索</el-button>
        <el-button :loading="loading" @click="handleReset" class="mr-8">重置</el-button>
        <slot name="button" />
        <el-button v-if="canFold" type="primary" link @click="fold = false">展开</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.top-radius {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.search-container {
  // border-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: var(--el-searchForm-bg-color);
  margin-bottom: 8px;

  .tabs_container {
    padding: 0 16px;
  }

  ._search-form-wrap {
    display: flex;
    overflow: hidden;
    //margin-bottom: 20px;

    padding: 18px;

    .one-line-botton {
      flex: 0 0 fit-content;
    }

    .el-search-botton-wrap,
    .one-line-botton {
      .el-button {
        padding: 6px 16px;
      }
    }

    .form-item-content {
      display: inline-block;
    }

    ._search-form {
      --el-search-item: 300px;
      --el-search-item-large: 455px;
      --el-search-item-small: 240px;

      .el-form-item {
        width: var(--el-search-item);
        height: 32px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        box-sizing: content-box;
        margin-bottom: 16px;
        margin-right: 16px;

        .el-form-item__content {
          flex: 1;
          display: flex;
        }

        .el-form-item__label {
          padding: 0 8px;
          font-size: 14px;
          line-height: 32px;
          position: relative;

          &::after {
            width: 1px;
            height: 14px;
            content: '';
            display: block;
            position: absolute;
            right: 0;
            top: 10px;
            background-color: var(--el-border-color);
          }
        }

        .el-input__wrapper {
          box-shadow: none !important;
          padding: 0 8px;
        }

        &.no-label > .el-form-item__content {
          max-width: var(--el-search-item);
        }

        &.el-search-item-small {
          width: var(--el-search-item-small);

          &.no-label .el-form-item__content {
            max-width: var(--el-search-item-small);
          }
        }

        &.el-search-item-large {
          width: var(--el-search-item-large);

          &.no-label > .el-form-item__content {
            max-width: var(--el-search-item-large) !important;
          }
        }

        &.el-search-item-auto {
          width: auto;

          .el-form-item__content {
            max-width: unset;
          }
        }

        &.el-search-botton-wrap {
          border: none;
        }
      }

      .el-form-item__content > .el-input,
      .el-cascader,
      .el-select {
        width: 100%;

        &.with100 {
          width: 100px;
        }

        &.select-label {
          width: 105px;
          margin-right: 5px;

          .el-input__suffix-inner > :first-child {
            margin-left: 0;
          }
        }
      }

      .el-select__wrapper {
        box-shadow: none;
      }

      .el-input-number {
        flex: 1;
      }

      .el-input-number + .el-input-number {
        position: relative;
        margin-left: 14px;

        &::before {
          position: absolute;
          content: '-';
          left: -9px;
        }
      }

      .el-select {
        .el-tag {
          max-width: 145px !important;
        }
      }
    }
  }
}
</style>
