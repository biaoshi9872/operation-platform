<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import OfflineMoneyTransfers from './OfflineMoneyTransfers.vue'
import { cloneDeep } from 'lodash-es'
interface IProp {
  curryInfo: any,
  userInfo:any
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
  showOfflineMoneyTransfers:boolean,
  submitLoading: boolean,
}
const data = reactive<IData>({
  formData: {
    amount: ''
  },
  showOfflineMoneyTransfers: false,
  formDataBK: {},
  formRules: {
    amount: [{ required: true, message: '请输入充值金额', trigger: ['change', 'blur'] }],
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
    ...data.formDataBK
  }
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.showOfflineMoneyTransfers=true
  })
}

const handleChange=(value:any)=>{
  if(value<100){
    ElMessage.warning('最小充值金额为100元')
    data.formData.amount=100
  }
}

</script>
<template>
  <el-dialog v-bind="$attrs" title="申请充值" width="500px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-alert title="提示：最小充值金额为100元" type="warning" class="mb-20" show-icon :closable="false" />
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right">
        <el-form-item label="公司名称" class="mb-20">
         <span> VIBOT V链平台</span>
        </el-form-item>
        <el-form-item label="充值金额" prop="amount">
          <el-input-number v-model="data.formData.amount" :precision="2"  @change="handleChange" :controls="false" :min="100" :max="999999999" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="mr-10">取消</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">立即支付</el-button>
      </div>
    </template>
  </el-dialog>
  <OfflineMoneyTransfers v-model="data.showOfflineMoneyTransfers" @refresh="handleClose" :curryInfo="data.formData"></OfflineMoneyTransfers>
</template>
<style lang="scss" scoped>

</style>