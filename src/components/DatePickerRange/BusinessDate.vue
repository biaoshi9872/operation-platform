<script setup lang="ts">
defineOptions({
  name: 'BusinessDate'
})
import dayjs from 'dayjs'
import { isNullOrUnDefOrisEmpty } from '@/utils/is'

interface dataPickerTypes {
  start: string
  end: string
  showTitle: boolean
}

const props = withDefaults(defineProps<Partial<dataPickerTypes>>(), {
  start: '',
  end: '',
  showTitle: false
})

const emits = defineEmits<{
  (e: 'update:start', value: string): string
  (e: 'update:end', value: string): string
}>()

const startValue = computed({
  get() {
    return props.start
  },
  set(value) {
    emits('update:start', value)
  }
})

const endValue = computed({
  get() {
    return props.end
  },
  set(value) {
    if (isNullOrUnDefOrisEmpty(value)) {
      emits('update:end', '2199-01-01')
    } else {
      emits('update:end', value)
    }
  }
})

const startDisableData = (time: Date) => {
  if (dayjs(time).isAfter(dayjs(endValue.value))) return true
  else return false
}

const endDisableData = (time: Date) => {
  if (dayjs(time).isBefore(dayjs(startValue.value))) return true
  else return false
}

let endValueFormat = ref('YYYY-MM-DD')

watch(
  () => props.end,
  (newValue, oldValue) => {
    if (newValue === '2199-01-01' || newValue === '2199-01-01 00:00:00' || oldValue === '2199-01-01 00:00:00') {
      endValueFormat.value = '无固定期限'
    } else {
      endValueFormat.value = 'YYYY-MM-DD'
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>
<template>
  <div class="flex w-400">
    <el-date-picker
      v-model="startValue"
      type="date"
      value-format="YYYY-MM-DD 00:00:00"
      placeholder="起始日期"
      :disabled-date="startDisableData"
    />&nbsp;&nbsp;~&nbsp;&nbsp;
    <el-date-picker
      v-model="endValue"
      ref="endDateRef"
      :disabled-date="endDisableData"
      :format="endValueFormat"
      type="date"
      value-format="YYYY-MM-DD 23:59:59"
      placeholder="截止日期"
    />
    <div></div>
  </div>
  <div class="w-400 color-#ccc" v-if="showTitle">当企业营业期限为长期时，可不选择结束日期</div>
</template>
<style lang="scss" scoped></style>
