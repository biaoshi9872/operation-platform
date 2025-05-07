<script setup lang="ts">
defineOptions({ name: 'CustomPagination' })
import { ElTable } from 'element-plus'
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const $router = useRouter()
const route = useRoute()


const props = defineProps({
  page: {
    type: Object,
    required: true,
    default: () => ({
      page: 1,
      limit: 10,
      total: 0
    })
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
  }
})

const emits = defineEmits(['currentChange', 'handleSizeChange', 'pagingQuery'])

// 分页
const currentChange = (number: number) => {
  emits('currentChange', number)
  emits('pagingQuery')
}
//
const handleSizeChange = (number: number) => {
  emits('handleSizeChange', number)
  emits('pagingQuery')
}



</script>

<template>
  <div class="customPagination">
    <el-pagination v-bind="$attrs" background v-model:current-page="props.page[props.pageMap.get('currentPage')]"
      v-model:page-size="props.page[props.pageMap.get('pageSize')]" small
      layout="total, sizes, prev, pager, next, jumper" :total="parseInt(props.page[props.pageMap.get('pageTotal')])"
      @size-change="handleSizeChange" @current-change="currentChange" />
  </div>
</template>

<style scoped lang="scss">
.customPagination {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding: 4px 16px;
  background-color: var(--el-searchForm-bg-color);
}
</style>
