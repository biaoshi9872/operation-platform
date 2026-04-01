<script setup lang="ts">
defineOptions({
  name: 'AppSelect'
})
import goodPool_api from '@/api/goodPool/index'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import { getLocal, removeLocal, setLocal } from '@/utils/storage'
import { decrypted, strDecodeURIComponent } from '@/utils/encrypt'
const { getSystemOptionType } = isStateCheckHooks()
const $route = useRoute()
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

const appList = ref<any[]>([])

onMounted(() => {
  init()
})

const init = () => {
  const userInfo = getLocal('userInfo')
  let projectId = $route.query?.projectId || ""
  let deProjectId = strDecodeURIComponent(projectId)
  let appInfoStr = decrypted(deProjectId)
  let appInfoObj = {
    appId:''
  }
  if(appInfoStr){
   appInfoObj = JSON.parse(appInfoStr)
  }
  let type = getSystemOptionType.value
  goodPool_api.A_getGoodsSourceList({ orgId: userInfo.orgId, appId: appInfoObj?.appId, type }).then((res: any) => {
    appList.value = res
  })
}

const placeholder = computed(() => {
  return '请选择'
})
</script>
<template>
  <el-select v-model="value" :placeholder="placeholder" filterable clearable collapse-tags :multiple="multiple"
    collapse-tags-tooltip>
    <el-option v-for="(item, index) in appList" :key="item[props.valueKey]" :value="item[props.valueKey]"
      :label="item[props.valueLabel]"></el-option>
  </el-select>
</template>

<style lang="scss" scoped></style>
