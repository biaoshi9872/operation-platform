<!--
 * @Descripttion: 所属供应商组件--多页面复用 
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-03-28 17:09:15
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-03-28 17:11:47
-->
<script setup lang="ts">
defineOptions({
  name: 'ApplicationSelect'
})
// import { A_getAllDictionaries } from '@/api/proudectManger'
import application_api from '@/api/system/application/index'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { decryptApplicationSource } = isStateCheckHooks()
interface IProp {
  modelValue: string
  multiple: boolean
  valueKey: string
  valueLabel: string
}
const props = withDefaults(defineProps<IProp>(), {
  modelValue: '',
  multiple: true,
  valueKey: 'appCode',
  valueLabel: 'appName',
  supplyType: '1'
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const value = computed({
  get() {
    if (props.multiple) {
      return props.modelValue || []
    } else return props.modelValue || null
  },
  set(value: any) {
    emits('update:modelValue', value)
  }
})

const data = reactive({
  applicationList: [] as any
})

onMounted(() => {
  init()
})

const init = () => {
  getAllDictionaries()
}

const getAllDictionaries = () => {
  let obj: any = {}
  console.log(decryptApplicationSource)
  debugger

  application_api.A_list(obj).then((res: any) => {
    data.applicationList = res || []
  })
}
</script>
<template>
  <el-select v-model="value" placeholder="请选择应用" filterable clearable collapse-tags multiple collapse-tags-tooltip>
    <el-option v-for="(item, index) in data.applicationList" :key="index" :value="item[props.valueKey]" :label="item[props.valueLabel]"></el-option>
  </el-select>
</template>

<style lang="scss" scoped></style>
