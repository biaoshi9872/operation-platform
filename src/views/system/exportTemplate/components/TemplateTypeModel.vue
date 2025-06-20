<script setup lang="ts">
import exportTemplate_api from '@/api/exportTemplate/index';
import { ElMessage, FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';

interface IProp {
  curryInfo: any,
}
const props = withDefaults(defineProps<IProp>(), {
  curryInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any
interface IData {
  formData: any,
  formDataBK: any,
  formRules: any,
  submitLoading: boolean,
}
const data = reactive<IData>({
  formData: {
    templateType: '',
    templateName: ''
  },
  formDataBK: {},
  formRules: {
    templateType: [{ required: true, message: '请输入模板编码', trigger: ['change', 'blur'] }],
    templateName: [{ required: true, message: '请输入模板名称', trigger: ['change', 'blur'] }],
  },
  submitLoading: false,
})
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  emits('update:modelValue', false)
}
const handleClose = () => {
  handleReset()
  emits('refresh')
  emits('update:modelValue', false)
}

onMounted(() => {
  data.formDataBK = cloneDeep(data.formData)
})
const openHandler = () => {
  data.formData = {
    ...data.formDataBK,
  }
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    exportTemplate_api.A_addTemplateType({ ...data.formData }).then(res => {
      ElMessage.success('操作成功！')
      handleClose()
    }).finally(() => {
      data.submitLoading = false
    })
  })
}


</script>
<template>
  <el-dialog v-bind="$attrs" title="导入模板类型设置" width="500px" append-to-body @open="openHandler" draggable
    destroy-on-close :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="100px">
        <el-form-item label="模板编码" prop="templateType">
          <el-input v-model="data.formData.templateType"></el-input>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="data.formData.templateName"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="mr-10">取消</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>