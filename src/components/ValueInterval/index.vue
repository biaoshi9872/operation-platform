
<template>
  <div class="select-value-interval-container">
    <el-input-number
      v-model="inputStartValue"
      placeholder="请输入起始值"
      :precision="precision"
      :max="99999999"
      :controls="false"
      @change="valueChange('startValue',$event)"
    />
    <span>-</span>
    <el-input-number
      v-model="inputEndValue"
      placeholder="请输入结束值"
      :precision="precision"
      :max="99999999"
      :controls="false"
      @change="valueChange('endValue',$event)"
    />
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'ValueInterval'
})
import { ElMessage } from 'element-plus'
interface IProp {
  startValue: number | null
  endValue: number | null
  precision: number | null
}
const props = withDefaults(defineProps<IProp>(), {
  startValue: null,
  endValue: null,
  precision: 2
})
const emits = defineEmits<{
  (e: 'update:startValue', value: any): void
  (e: 'update:endValue', value: any): void
}>()

const inputStartValue = computed({
  get() {
    return props.startValue
  },
  set(val) {
    emits('update:startValue', val)
  }
})

const inputEndValue = computed({
  get() {
    return props.endValue
  },
  set(val) {
    emits('update:endValue', val)
  }
})

const valueChange = (type: 'startValue' | 'endValue', value: any) => {
  if (type === 'startValue') {
    if (value && props.endValue && props.endValue < value) {
      ElMessage.error('开始值不能大于结束值')
      emits('update:startValue', null)
      return
    }
    console.log(value)
  } else {
    if (value && props.startValue && props.startValue > value) {
      ElMessage.error('结束值不能小于开始值')
      emits('update:endValue', null)
      return
    }
  }
}
</script>
<style lang="scss" scoped>
.select-value-interval-container {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>