<!--
 * @Descripttion 列表组件 -- 所有列表都应该用此组件
 * @version: 
 * @Author: biao.shi
 * @Date: 2022-06-13 18:54:45
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-21 09:25:27
-->
<template>
  <div class="table_model_container">
    <div class="option_box">
      <div class="option_container">
        <slot name="option"></slot>
      </div>
      <ColumnConfig v-if="filedConfigData.filedConfigList.length && openFiledConfig"
        :columnConfigs="filedConfigData.filedConfigList" :saveFiledConfigData="saveFiledConfigData"></ColumnConfig>
    </div>
    <div class="option_content">
      <slot name="content"></slot>
      <div class="mt-4 mb-4" v-if="alertTitle">
        <el-alert :title="alertTitle" type="warning" show-icon />
      </div>
      <slot name="headerContent"></slot>
    </div>
  </div>
  <div class="table_model_box" v-loading="props.loading" ref="tableBoxRef">
    <el-table :data="listTableData" border ref="multipleTableRef" :scrollbar-always-on="scrollbarAlwaysOn" height="100%"
      v-bind="$attrs" :row-key="rowKey" :row-class-name="tableRowClassName" @row-click="rowClick"
      @row-contextmenu="rowContextmenu">
      <!--- 插入字段 -->
      <slot name="selection"></slot>
      <slot></slot>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
  </div>
  <div v-if="props.isShowPagination" class="pagination-box">
    <el-pagination v-bind="$attrs" background v-model:current-page="props.page[props.pageMap.get('currentPage')]"
      v-model:page-size="props.page[props.pageMap.get('pageSize')]" small
      layout="total, sizes, prev, pager, next, jumper" :total="parseInt(props.page[props.pageMap.get('pageTotal')])"
      @size-change="handleSizeChange" @current-change="currentChange" />
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'TableModel' })
import { cloneDeep } from 'lodash-es'
import { ElTable } from 'element-plus'
import { useRoute } from 'vue-router'
import filedConfigHooks from '@/hooks/filedConfigHooks'
const { filedConfigData, saveFiledConfigData, getConfigData, isFieldShow } = filedConfigHooks()
const route = useRoute()
const tabsInfo = inject(
  'tabsInfo',
  computed(() => {
    return true
  })
) as any
watch(
  () => tabsInfo.value,
  () => {
    // 移除调试日志，保留业务调用
    getFiledConfigData()
  },
  { deep: true }
)
provide('isFieldShow', isFieldShow)
//是否开启字段配置
const getFiledConfigData = async () => {
  if (props.openFiledConfig) {
    let filedSubStr = ''
    if (props.dataPage?.facadeKz) {
      Object.keys(props.dataPage.facadeKz).forEach(key => {
        filedSubStr += `${key}_${props.dataPage.facadeKz[key]}`
      })
    }
    let filedMainKey = props.filedMainKey || route.path
    let filedSubKey = props.filedSubKey || filedSubStr
    let res = await getConfigData(filedMainKey, filedSubKey)
  }
}

const props = defineProps({
  //是否开启列配置
  openFiledConfig: {
    type: Boolean,
    default: true
  },
  //列配置关键字
  filedMainKey: {
    type: String,
    default: ''
  },
  //列配置子关键字
  filedSubKey: {
    type: String,
    default: ''
  },
  //列配置
  filedConfig: {
    type: Object,
    default: {}
  },
  //分页配置
  dataPage: {
    type: Object,
    default: {}
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  alertTitle: {
    type: String,
    default: ''
  },
  page: {
    type: Object,
    required: true,
    default: () => ({
      page: 1,
      limit: 10,
      total: 0
    })
  },
  openERP: {
    type: Boolean,
    default: false
  },
  pageMap: {
    type: Object,
    default: () => {
      return new Map([
        ['currentPage', 'page'],
        ['pageSize', 'limit'],
        ['pageTotal', 'totalCount']
      ])
    }
  },
  listTableData: {
    type: Array,
    required: true,
    default: () => []
  },
  isShowPagination: {
    type: Boolean,
    default: true
  }
})

const data = reactive({
  curryRow: {},
  scrollTop: 0,
  scrollLeft: 0
})

watch(route, () => {
  const { highlightKey } = route.query
  if (highlightKey) {
    if (data.curryRow) {
      //@ts-ignore
      data.curryRow[props.rowKey] = highlightKey
    }
  }
})

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.hasOwnProperty(props.rowKey)) {
    //@ts-ignore
    if (String(data.curryRow[props.rowKey]) === String(row[props.rowKey])) return 'success-row'
  } else {
    //@ts-ignore
    if (String(data.curryRow['customerId_index']) === String(rowIndex)) return 'success-row'
  }
}

const rowClick = (row: any, column: any, event: any) => {
  if (row.hasOwnProperty(props.rowKey)) {
    data.curryRow = cloneDeep(row)
  } else {
    data.curryRow = cloneDeep(row)
    //@ts-ignore
    data.curryRow['customerId_index'] = props.listTableData.indexOf(row)
  }
}

// 新增：右键菜单透传事件
const emits = defineEmits(['currentChange', 'rowContextmenu', 'handleSizeChange', 'pagingQuery'])
const rowContextmenu = (row: any, column: any, event: MouseEvent) => {
  emits('rowContextmenu', row, column, event)
}

const currentChange = (number: number) => {
  emits('currentChange', number)
  emits('pagingQuery')
}
const handleSizeChange = (number: number) => {
  emits('handleSizeChange', number)
  emits('pagingQuery')
}
</script>
<style scoped lang="scss">
:deep(.el-table) {
  overflow: visible;
}

.table_model_box {
  min-height: 200px;
  flex: 1;
  padding: 0 8px;
  background-color: #fff;

  ::v-deep(.el-table .success-row) {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
}

.table_model_container {
  background-color: #fff;
  padding: 8px;

  .option_box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .option_container {
      display: flex;

      // > :nth-child(1) {
      //   ::v-deep(.auth_button) {
      //     margin: 0 !important;
      //   }
      // }
    }
  }
}

.pagination-box {
  padding: 18px !important;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid var(--el-border-color);
}
</style>
