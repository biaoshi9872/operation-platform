<script setup lang="ts">
defineOptions({
  name: 'OrgSelect'
})
import org_api from '@/api/system/org'

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

const orgList = ref<any[]>([])

onMounted(() => {
  init()
})

const init = () => {
  org_api.A_selectList({}).then((res: any) => {
    orgList.value = res
  })
}

const placeholder = computed(() => {
  if (props.valueLabel == 'name') {
    return '请选择机构名称'
  } else if (props.valueLabel == 'customerName') {
    return '请选择客户名称'
  } else if (props.valueLabel == 'id') {
    return '请选择机构ID'
  } else
    return '请选择'
})
</script>
<template>
  <el-select v-model="value" :placeholder="placeholder" filterable clearable collapse-tags :multiple="multiple"
    collapse-tags-tooltip>
    <el-option v-for="(item, index) in orgList" :key="item[props.valueKey]" :value="item[props.valueKey]"
      :label="item[props.valueLabel]"></el-option>
  </el-select>
</template>

<style lang="scss" scoped></style>
