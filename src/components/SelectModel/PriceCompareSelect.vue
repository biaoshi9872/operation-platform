<script setup lang="ts">
import goodPoor from '@/utils/constant/goodPoor'
const props = defineProps<{
  value1: any
  value2: any
  value3: any
}>()
const emit = defineEmits({
  'update:value1': (val: any) => {},
  'update:value2': (val: any) => {},
  'update:value3': (val: any) => {}
})

const value1Model = computed({
  get() {
    return props.value1
  },
  set(val) {
    emit('update:value1', val)
  }
})

const value2Model = computed({
  get() {
    return props.value2
  },
  set(val) {
    emit('update:value2', val)
  }
})

const value3Model = computed({
  get() {
    return props.value3
  },
  set(val) {
    emit('update:value3', val)
  }
})
</script>
<template>
  <el-form-item label="价格关系" class="component-container">
    <el-select v-model="value1Model" placeholder="选择价格">
      <el-option v-for="item in goodPoor.priceRelationTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-model="value2Model" placeholder="计算关系">
      <el-option v-for="item in goodPoor.priceCompareTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-model="value3Model" placeholder="选择价格">
      <el-option v-for="item in goodPoor.priceRelationTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </el-form-item>
</template>
<style lang="scss" scoped>
.component-container {
  display: flex;
  width: 500px !important;
  ::v-deep(.el-form-item__content) {
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>