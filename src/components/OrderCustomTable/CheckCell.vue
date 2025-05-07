<!--
 * @Descripttion:下拉组件  -- 类似与走接口取数据的组件，默认查询功能
 * @version: 
 * @Author: biao.shi
 * @Date: 2022-06-13 18:54:45
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-21 09:25:27
-->
<script setup lang="ts">
defineOptions({
  name: 'CheckCell'
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'rowCheckedHandler', event: any, value: any, item: any): void
}>()

interface IProp {
  parentRow?: any
  multipleList?: Array<any>
  dataList: Array<any>
  index: number
  foldState?: any
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

const rowCheckedHandler = (e: any, index: any, item: any) => {
  //触发
  emits('rowCheckedHandler', e, index, item)
}
</script>
<template>
  <div class="cell" v-for="(item, index) in renderList">
    <el-checkbox v-model="item.check" :true-label="true" :false-label="false" size="large" @change="rowCheckedHandler($event, index,item)" />
  </div>
</template>
<style scoped lang="scss">
.cell {
  width: 100%;
  display: flex;
  flex: 1;
  flex-shrink: 0;
  align-items: center;
  padding: 12px 10px;
  box-sizing: border-box;
  justify-content: center;
}
</style>
