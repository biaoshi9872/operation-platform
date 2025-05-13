<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
// import { A_orderCancel } from '@/api/orderManger'

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
  formData: {
    agreeFlag: string
    cancelReason: string
  }
  formDataBK: any
  formRules: any
  tableFromData: any
  submitLoading: boolean
}
const data = reactive<IData>({
  formData: {
    agreeFlag: '2',
    cancelReason: ''
  },
  formDataBK: {},
  formRules: {
    agreeFlag: [{ required: true, message: '请选择审核意见', trigger: ['change', 'blur'] }],
    cancelReason: [{ required: true, message: '请填写拒绝理由', trigger: ['change', 'blur'] }]
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
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    const { formData } = data as any
    const { orderNo } = props.curryInfo
    // A_orderCancel({ ...formData, orderNo }).then(res => {
    //   ElMessage.success('操作成功！')
    //   handleClose()
    // })
  })
}
</script>
<template>
  <el-dialog
    v-bind="$attrs"
    title="取消审核"
    width="500px"
    @open="openHandler"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @closed="handleReset"
  >
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" label-position="right" label-width="100px" :rules="data.formRules">
        <el-form-item label="审核意见" prop="agreeFlag">
          <el-radio-group v-model="data.formData.agreeFlag">
            <el-radio label="2">通过</el-radio>
            <el-radio label="3">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="data.formData.agreeFlag === '3'" label="拒绝理由" prop="cancelReason">
          <el-input v-model="data.formData.cancelReason" type="textarea" maxlength="200" show-word-limit></el-input>
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
