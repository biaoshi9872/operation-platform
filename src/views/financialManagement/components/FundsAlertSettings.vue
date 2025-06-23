<script setup lang="ts">
import moneyManagement_api from '@/api/moneyManagement/index';
import { validatePhone } from '@/utils/validator';
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
  tableFromData: any,
  submitLoading: boolean,
}
const data = reactive<IData>({
  formData: {
    amountWarningThreshold: '',
    warningPhone: ''
  },
  formDataBK: {},
  formRules: {
    amountWarningThreshold: [{ required: true, message: '请输入账户余额预警阀值设置', trigger: ['change', 'blur'] }],
    warningPhone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: validatePhone, trigger: 'blur' }
    ],
  },
  tableFromData: {},
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
  searchQueryHandler()
  emits('update:modelValue', false)
}
const searchQueryHandler = inject('searchQueryHandler', () => { })
onMounted(() => {
  data.formDataBK = cloneDeep(data.formData)
})
const openHandler = () => {
  data.formData = {
    ...data.formDataBK,
    ...props.curryInfo
  }
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    const { warningStatus = 1 } = props.curryInfo
    const { formData } = data
    moneyManagement_api.A_updatePrepaidDepositRechargeWarnConfig({ ...formData, warningStatus }).then((res: any) => {
      ElMessage.success('修改成功!')
      handleClose()
    })
  })
}
</script>
<template>
  <el-dialog v-bind="$attrs" title="预警阀值修改" width="600px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-alert title="注意：当账户余额小于该值时，每天短信提醒一次，费用由您自己承担。" type="warning" class="mb-20" show-icon :closable="false" />
      <el-form ref="formRef" :model="data.formData" label-suffix=":" label-width="200px" :rules="data.formRules"
        label-position="right">
        <el-form-item label="账户余额预警阀值设置" prop="amountWarningThreshold">
          <el-input-number v-model="data.formData.amountWarningThreshold" class="w-200" :precision="2" :controls="false"
            :min="0" :max="9999999999" />
        </el-form-item>
        <el-form-item label="接收提醒的手机号" prop="warningPhone">
          <el-input v-model="data.formData.warningPhone" class="w-200" placeholder="请输入11位手机号码" clearable
            show-word-limit maxlength="11"></el-input>
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