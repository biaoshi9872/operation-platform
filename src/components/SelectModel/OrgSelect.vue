<script setup lang="ts">
defineOptions({
  name: 'OrgSelect'
})
import org_api from '@/api/system/org'

interface IProp {
  modelValue: string
  multiple: boolean
}
type Tenant = {
  name: string
  id: string
}
const props = withDefaults(defineProps<IProp>(), {
  modelValue: '',
  multiple: false
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

const orgList = ref<Tenant[]>([])

onMounted(() => {
  init()
})

const init = () => {
  org_api.A_selectList({}).then((res: any) => {
    orgList.value = res
  })
}
</script>
<template>
  <el-select v-model="value" placeholder="请选择分支机构" filterable clearable collapse-tags :multiple="multiple" collapse-tags-tooltip>
    <el-option v-for="(item, index) in orgList" :key="item.id" :label="item.name" :value="item.id "></el-option>
  </el-select>
</template>

<style lang="scss" scoped></style>
