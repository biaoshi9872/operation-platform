<!--
 * @Descripttion: 
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-02-17 16:33:19
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-05-25 14:01:36
-->
<template>
  <!--- 输入文本框-->
  <el-input v-if="props.field.type === 'input'" class="w-250" :show-word-limit="true" :maxLength="props.field.maxLength"
    clearable v-bind="$attrs" :disabled="disabled" :placeholder="`请输入${props.field.name}`"> </el-input>
  <!--- 下拉框 -->
  <el-select v-if="props.field.type === 'select'" class="w-250" clearable filterable v-bind="$attrs" :disabled="disabled"
    :placeholder="`请选择${props.field.name}`">
    <el-option v-for="item in props.field.options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <el-select v-if="props.field.type === 'multipleSelect'" class="w-250" collapse-tags collapse-tags-tooltip multiple
    clearable filterable v-bind="$attrs" :disabled="disabled" :placeholder="`请选择${props.field.name}`">
    <el-option v-for="item in props.field.options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <!---多选 -->
  <el-checkbox-group v-if="props.field.type === 'checkbox'" v-bind="$attrs" :disabled="disabled">
    <template v-for="item in props.field.options" :key="item.value">
      <el-checkbox :label="item.value">{{ item.label }}</el-checkbox>
    </template>
  </el-checkbox-group>
  <!-- 单选 -->
  <el-radio-group v-if="props.field.type === 'radio'" v-bind="$attrs" :disabled="disabled">
    <el-radio label="1">{{ props.field.name }}</el-radio>
  </el-radio-group>
  <!---数值框 inputNumber -->
  <el-input-number v-if="props.field.type === 'inputNumber'" v-bind="$attrs" :disabled="disabled" :min="0" />
  <!---自定义组件 -->
  <template v-if="props.field.type === 'component'">
    <component v-bind="$attrs" :disabled="disabled" :is="props.field.component"></component>
  </template>
</template>
<script lang="ts" name="DynamiComponent" setup>
import { computed, reactive, ref } from 'vue'

type TfromState = 'add' | 'edit'

interface IProp {
  field: Filed
  fromState?: TfromState
}

const props = withDefaults(defineProps<IProp>(), {
  fromState: 'add'
})
/**
 * 是否编辑
 */
const disabled = computed(() => {
  if (props.field?.disabledFunc) {
    const isDisabled = props.field?.disabledFunc(props.fromState) || false
    return isDisabled
  }
  return props.field.disabled || false
})



</script>
<style lang="scss" scoped>
.input-wrap {
  display: inline-flex;
}

::v-deep .el-month-tabl {
  a {
    text-decoration: none !important;
  }
}
</style>
