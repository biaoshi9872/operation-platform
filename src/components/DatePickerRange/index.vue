<!--
 * @Descripttion: 时间区间控件-- 方便将时间数组结构拍平两个字段存储
 * @version: 
 * @Author: biao.shi
 * @Date: 2022-06-13 18:54:45
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-21 09:25:27
-->
<script lang="ts" setup>
defineOptions({ name: 'DatePickerRange' })
import dayjs from 'dayjs'

interface dataPickerTypes {
  dateRangeType: string
  start: string
  end: string
  dateFormat: string
  isOpenTime: boolean
  dataRange: number
  isShowPickerOptions?: boolean
  disabledDateCustom: Function | null
}

const props = withDefaults(defineProps<Partial<dataPickerTypes>>(), {
  dateRangeType: 'datetimerange',
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
  isOpenTime: false,
  dataRange: 0,
  disabledDateCustom: null
})
const defaultTime2: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)] // '0:00:00', '23:59:59'
const emits = defineEmits<{
  (e: 'update:start', value: string): string
  (e: 'update:end', value: string): string
  (e: 'timeValidateField', value: string): void
}>()

const pickerOptions = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

const innerValue = computed({
  get() {
    if (props.start && props.end) {
      return [props.start, props.end]
    } else {
      return null
    }
  },
  set(value) {
    emits('update:start', value ? dayjs(value[0]).format(props.dateFormat) : '')
    emits('update:end', value ? dayjs(value[1]).format(props.dateFormat) : '')
    emits('timeValidateField', '')
  }
})

// 当前选择的开始日期
const pickDay = ref(null)

const disabledDate = (time: any) => {
  //填数显示
  if (props.dataRange > 0) {
    if (!pickDay.value) {
      return false
    } else {
      const con1 = new Date(pickDay.value).getTime() - props.dataRange * 24 * 60 * 60 * 1000
      const con2 = new Date(pickDay.value).getTime() + props.dataRange * 24 * 60 * 60 * 1000
      return time < con1 || time > con2
    }
  }
  //1.自定义校验格式
  if (props.disabledDateCustom) {
    return props.disabledDateCustom(time)
  }
  return false
}

// 日期选择器选择时触发
function handleChange(val: any) {
  const [pointDay] = val
  pickDay.value = pointDay
}
// 日期选择器获得焦点时触发
function handleFocus() {
  pickDay.value = null
}
</script>
<template>
  <el-date-picker class="date-picker-box max-w-110" v-model="innerValue" v-bind="$attrs" :type="dateRangeType"
    :format="dateFormat" :value-format="dateFormat" :default-time="dateRangeType === 'dateRange' ? null : defaultTime2"
    unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :disabled-date="disabledDate"
    @calendar-change="handleChange" @focus="handleFocus" :shortcuts="props.isShowPickerOptions ? pickerOptions : []" />
</template>
<style scoped lang="scss">
.date-picker-box {
  ::v-deep(.el-date-editor .el-range-separator) {
    color: none;
  }
}
</style>
