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
import systemUtils_api from '@/api/system/systemUtils/index'

interface IProp {
  modelValue: string
  multiple: boolean
  supplyType: string
  valueKey: string
  valueLabel: string
  hasJdChance: boolean
}
const props = withDefaults(defineProps<IProp>(), {
  modelValue: '',
  multiple: true,
  hasJdChance: false,
  valueKey: 'id',
  valueLabel: 'supplyName',
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
  supplierList: [] as any
})

onMounted(() => {
  init()
})

const init = () => {
  getAllDictionaries()
}

const getAllDictionaries = () => {
  systemUtils_api.A_supplierSelect({}).then((res: any) => {
    let list = Object.keys(res).map((key) => {
      return {
        id: key,
        supplyName: res[key]
      }
    })
    data.supplierList = list
  })
}
</script>
<template>
  <el-select v-model="value" placeholder="请选择供应商" filterable clearable collapse-tags multiple collapse-tags-tooltip>
    <el-option v-for="(item, index) in data.supplierList" :key="index" :value="item[props.valueKey]"
      :label="item[props.valueLabel]"></el-option>
  </el-select>
</template>

<style lang="scss" scoped></style>
