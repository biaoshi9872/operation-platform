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
  name: 'SelectModel'
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update:name', value: any): void
  (e: 'onResize', value: any): void
}>()

interface Props {
  filterable: boolean
  selectList: any

  multiple: any
  isShowAll: boolean
  keyMap: any
}

const modelValue = defineModel({
  get(val: any) {
    if (multipleTag.value) {
      return val ?? []
    } else return val ?? null
  },
  set(val: any) {
    return val
  }
})

const props = withDefaults(defineProps<Partial<Props>>(), {
  filterable: true,
  multiple: false,
  selectList: [],
  isShowAll: false,
  keyMap: {
    key: 'value',
    valueKey: 'label'
  }
})

const multipleTag = computed(() => {
  if (props.multiple) {
    return true
  } else {
    if (optionList.value.length >= 3 && !props.isShowAll) {
      return true
    } else return false
  }
})

const optionList = computed(() => {
  return props.selectList.map((el: any) => {
    return {
      label: el[props.keyMap.valueKey],
      value: el[props.keyMap.key]
    }
  })
})

const changeHandler = (e: any) => {
  emits('update:name', name)
  emits('update:modelValue', e)
}
</script>
<template>
  <el-select
    v-bind="$attrs"
    v-model="modelValue"
    ref="selectRef"
    clearable
    @change="changeHandler"
    :multiple="multipleTag"
    collapse-tags
    popper-class="select-w"
    :filterable="filterable"
  >
    <!-- 指定多选 -->
    <template v-if="multiple">
      <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </template>
    <!--- 自动转多选 -->
    <template v-else>
      <el-option v-if="!multipleTag" label="全部" value></el-option>
      <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </template>
  </el-select>
</template>
<style scoped lang="scss"></style>
