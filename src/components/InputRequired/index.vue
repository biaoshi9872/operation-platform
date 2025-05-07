

<script setup lang="ts"  name="InputRequired">
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()

const data = reactive({
  form: {
    valueData: ''
  }
})

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isView: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '请输入'
  },
  href: {
    type: String,
    default: '请输入'
  },
  type: {
    type: String,
    default: 'text'
  }
})


const emits = defineEmits(['update:modelValue', 'inputChangeHandler', 'blurHandler'])


watch(
  () => props.modelValue,
  newValue => {
    data.form.valueData = newValue
  },
  {
    immediate: true,
    deep: true
  }
)

//校验
const inputChangeHandler = (value: any) => {
  const val = getFormData(value)
  emits('update:modelValue', val)
  emits('inputChangeHandler')
  isValid()
}

const blurHandler = (value: any) => {
  emits('blurHandler')
}

const getFormData = (value: any) => {
  switch (props.type) {
    case 'text':
      return value
    case 'number':
      return (value = value.replace(/^(0+)|[^\d]+/g, ''))
    case 'amount':
      return (value = value.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, '$1'))
    default:
      return value
  }
}

const isValid = async () => {
  const res = await ruleFormRef.value?.validate()
  return res
}
const forceUpdate = () => {
  data.form.valueData = props.modelValue
}

defineExpose({
  isValid,
  forceUpdate
})
</script>
<template>
  <div v-if="!isView" class="main_box" :class="props.required ? '' : 'no_required_container'">
    <el-form ref="ruleFormRef" :model="data.form" :disabled="disabled" @submit.native.prevent>
      <el-form-item prop="valueData" :rules="[{ required: props.required, message: '此栏位不可空白', trigger: 'blur' }]">
        <el-input v-bind="$attrs" v-model="data.form.valueData" :placeholder="props.placeholder"
          @input="inputChangeHandler" @blur="blurHandler">
          <slot></slot>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
  <div v-else class="main_box_view">
    <span v-if="!props.href">{{ data.form.valueData }}</span>
    <el-tooltip v-else class="item" effect="dark" :content="data.form.valueData" placement="top">
      <a :href="data.form.valueData" target="_blank">{{ data.form.valueData }}</a>
    </el-tooltip>
  </div>
</template>
<style lang="scss" scoped>
.main_box_view {
  width: 100%;
  max-height: 30px;
  @include overflow(1);

  a {
    color: var(--el-color-primary);
    text-decoration-line: underline;
    word-wrap: break-word;
  }
}

.no_required_container {

  ::v-deep(.el-input__wrapper),
  ::v-deep(.el-input__wrapper.is-focus),
  ::v-deep(.el-input__wrapper:focus),
  ::v-deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px var(--el-border-color) inset !important;
  }
}
</style>
