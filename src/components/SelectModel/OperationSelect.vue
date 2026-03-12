<script setup lang="ts">
defineOptions({
  name: 'OrgSelect'
})
import systemUtils_api from '@/api/system/systemUtils'

interface IProp {
  modelValue: string
  multiple: boolean
  valueKey: string
  valueLabel: string
}

const props = withDefaults(defineProps<IProp>(), {
  modelValue: '',
  multiple: false,
  valueKey: 'id',
  valueLabel: 'name'
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

const operatorList = ref<any[]>([])

onMounted(() => {
  init()
})

const init = () => {
  systemUtils_api.A_getProjectOperatorList({}).then((res: any) => {
    operatorList.value = res
  })
}

const placeholder = computed(() => {
  return '请选择运营'
})
</script>
<template>
  <el-select v-model="value" :placeholder="placeholder" filterable clearable collapse-tags :multiple="multiple"
    collapse-tags-tooltip>
    <el-option v-for="(item, index) in operatorList" :key="item[props.valueKey]" :value="item[props.valueKey]"
      :label="item[props.valueLabel]"></el-option>
  </el-select>
</template>

<style lang="scss" scoped></style>
