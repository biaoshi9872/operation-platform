<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import order_enum from '@/utils/constant/order'
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
    orderNo: '',
    afterSaleType: '',
    reasonCode: '',
    reasonName: '',
    num: null,
    reasonDescription: '',
    images: ''
  },
  formDataBK: {},
  formRules: {
    afterSaleType: [{ required: true, message: '请选择售后类型', trigger: 'change' }],
    reasonCode: [{ required: true, message: '请选择退款原因', trigger: 'change' }],
    num: [{ required: true, message: '请输入售后数量', trigger: 'change' }],
    images: [{ required: true, message: '上传凭证', trigger: 'change' }],
    reasonDescription: [{ required: true, message: '请选择退款原因', trigger: ['change', 'blur'] }]
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
  formRef.value.validate().then(() => {})
}
const reasonForRefundList = computed(() => {
  return order_enum.reasonForRefundListObj[data.formData.afterSaleType]
})

const reasonChangeHandler = (value: any) => {
  data.formData.reasonName = reasonForRefundList.value.find((item: any) => item.value == value)?.label
}

const verifyHandler = () => {
  formRef.value?.validateField('images')
}
</script>
<template>
  <el-dialog
    v-bind="$attrs"
    title="申请售后"
    width="500px"
    append-to-body
    @open="openHandler"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @closed="handleReset"
  >
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" label-position="right" label-width="100px" :rules="data.formRules">
        <el-form-item label="售后类型" prop="afterSaleType">
          <el-radio-group v-model="data.formData.afterSaleType">
            <el-radio v-for="(item, index) in order_enum.AfterSalesType" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款原因" prop="reasonCode">
          <el-select v-model="data.formData.reasonCode" class="w-400" @change="reasonChangeHandler">
            <el-option v-for="(item, index) in reasonForRefundList" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售后数量" prop="num">
          <el-input-number v-model="data.formData.num" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="上传凭证">
          <ImgUpload
            :limit="3"
            :maxSize="5"
            v-model="data.formData.images"
            :isArray="false"
            @verify="verifyHandler"
            :acceptList="['bmp', 'png', 'jpg', 'jpeg']"
          ></ImgUpload>
        </el-form-item>
        <el-form-item label="说明" prop="reasonDescription">
          <el-input
            type="textarea"
            class="w-400"
            v-model="data.formData.reasonDescription"
            :rows="3"
            maxlength="200"
            show-word-limit
            placeholder="请输入说明"
          />
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