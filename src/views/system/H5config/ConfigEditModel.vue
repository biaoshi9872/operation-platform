<script setup lang="ts">
import configH5_api from '@/api/configH5/index';
import { ElMessage, FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';

interface IProp {
  curryInfo: any
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
  formData: any
  formDataBK: any
  formRules: any
  submitLoading: boolean
}
const data = reactive<IData>({
  formData: {
    name: '',
    key: '',
    value: '',
    remark: ''
  },
  formDataBK: {},
  formRules: {
    name: [{ required: true, message: '请填写参数名称', trigger: ['change', 'blur'] }],
    key: [{ required: true, message: '请填写参数健名', trigger: ['change', 'blur'] }],
    value: [{ required: true, message: '请填写参数健值', trigger: ['change', 'blur'] }]
  },
  submitLoading: false
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
    key: props.curryInfo.paramKey,
    value: props.curryInfo.paramValue,
    ...props.curryInfo
  }
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    const { id = '' } = props.curryInfo
    const { formData } = data
    data.submitLoading = true
    configH5_api.A_editSysConfig({ id, ...formData })
      .then(res => {
        ElMessage.success('操作成功！')
        handleClose()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}
</script>
<template>
  <el-dialog v-bind="$attrs" :title="curryInfo.id ? '编辑系统参数设置' : '新增系统参数设置'" width="500px" append-to-body
    @open="openHandler" draggable destroy-on-close :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="100px">
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="data.formData.name" maxlength="100" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数健名" prop="key">
          <el-input :disabled="curryInfo.id" maxlength="100" v-model="data.formData.key" placeholder="请输入参数健名" />
        </el-form-item>
        <el-form-item label="参数健值" prop="value">
          <el-input v-model="data.formData.value" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
            placeholder="请输入参数健值" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.formData.remark" maxlength="500" :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea" placeholder="请输入备注" />
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