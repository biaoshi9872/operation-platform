<script setup lang="ts">
import MyRender from './expand'
interface IColumn {
  label: string
  prop: string
  width?: string
  minWidth?: string
  align?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  marginAttr?: string
  marginProp?: string
  render?: Function
}

interface IProp {
  column: IColumn
  parentRow: any
  dataList: Array<any>
  index: number
  foldState: any
  openFold?: any
  type?: string
}
const props = defineProps<IProp>()

const renderList = computed(() => {
  if (props.type == 'no_margin') {
    if (!props.foldState && props.openFold) {
      let arr = props.dataList?.slice(0, 3)
      console.log(arr)
      return arr
    } else return props.dataList
  } else return props.dataList
})
</script>

<template>
  <div class="cell margin-cell" v-for="(item, index) in renderList" :key="index">
    <div class="cell-content" :style="{ 'text-align': column.align ? column.align : 'center' }">
      <!-- 自定义渲染内容 -->
      <div v-if="column.render">
        <MyRender :column="column" :row="item" :render="column.render" :index="index" :parentRow="parentRow" />
      </div>
      <!-- 默认渲染内容 -->
      <template v-else>
        <el-tooltip
          effect="dark"
          placement="top"
          :disabled="!column.showOverflowTooltip"
          :content="(column.marginAttr ? item[column.marginAttr] : item[column.prop]) ?? '-' "
        >
          <div
            :class="column.showOverflowTooltip?'overflow1':''"
          >{{ (column.marginAttr ? item[column.marginAttr] : item[column.prop]) ?? '-' }}</div>
        </el-tooltip>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin cell-content {
  padding: 8px 10px;
  box-sizing: border-box;
}
.overflow1 {
  @include overflow(1);
}

$border: 1px solid var(--theme-border-color-light);

.cell {
  width: 100%;
  //height: 70px;
  display: flex;
  flex: 1;
  flex-shrink: 0;
  align-items: center;
  @include cell-content();

  > .cell-content {
    width: 100%;
    flex: 1;
  }
}

.margin-cell:not(:last-child) {
  border-bottom: $border;
}
</style>
