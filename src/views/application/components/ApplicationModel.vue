<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { validatePhone, validateEmail } from '@/utils/validator'
import application_api from '@/api/system/application'

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
  tableFromData: any
  submitLoading: boolean
}
const data = reactive<IData>({
  formData: {
    appName: '',
    developerEmail: '',
    developerPhone: ''
  },
  formDataBK: {},
  formRules: {
    appName: [{ required: true, message: '请输入应用名称', trigger: ['change', 'blur'] }],
    developerEmail: [
      { required: true, message: '请输入开发者邮箱', trigger: ['change', 'blur'] },
      {
        validator: validateEmail,
        trigger: 'blur'
      }
    ],
    developerPhone: [
      { required: true, message: '请输入开发者手机', trigger: ['change', 'blur'] },
      {
        validator: validatePhone,
        trigger: 'blur'
      }
    ]
  },
  tableFromData: {},
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
  searchQueryHandler()
  emits('update:modelValue', false)
}
const searchQueryHandler = inject('searchQueryHandler', () => {})
onMounted(() => {
  data.formDataBK = cloneDeep(data.formData)
})
const openHandler = () => {
  data.formData = {
    ...data.formDataBK
  }
  if (props.curryInfo.id) {
    data.formData = {
      ...data.formDataBK,
      ...props.curryInfo
    }
  }
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    application_api
      .A_save({ ...data.formData, id: props.curryInfo?.id || null })
      .then(() => {
        ElMessage.success('操作成功!')
        handleClose()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}
const title = computed(() => {
  return props.curryInfo?.id ? '编辑应用' : '新增应用'
})
</script>
<template>
  <el-dialog
    v-bind="$attrs"
    :title="title"
    width="500px"
    append-to-body
    @open="openHandler"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @closed="handleReset"
  >
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right" label-width="100px">
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="data.formData.appName" placeholder="请输入应用名称" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="开发者邮箱" prop="developerEmail">
          <el-input v-model="data.formData.developerEmail" placeholder="请输入开发者邮箱" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="开发者手机" prop="developerPhone">
          <el-input v-model="data.formData.developerPhone" placeholder="请输入开发者手机" maxlength="11" show-word-limit></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="mr-10">取消</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>