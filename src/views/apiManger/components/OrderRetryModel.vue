<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import apiLinkProduct from '@/api/apiLinkProduct'
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
//校验地址
const addressInfoValidator = (rule: any, value: any, callback: any) => {
  if (!data.formData.provinceId || !data.formData.cityId || !data.formData.countyId) {
    callback(new Error('请选择省市区'))
  } else {
    callback()
  }
}
const data = reactive<IData>({
  formData: {
    provinceId: '',
    provinceName: '',
    cityId: '',
    cityName: '',
    countyId: '',
    countyName: '',
    townId: '',
    townName: '',
    address: ''
  },
  formDataBK: {},
  formRules: {
    address: [{ required: true, message: '请输入详细地址', trigger: ['change', 'blur'] }],
    addressInfo: [
      {
        required: true,
        validator: addressInfoValidator,
        message: '请选择省市区',
        trigger: ['change', 'blur']
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
  data.formData = {
    ...cloneDeep(data.formDataBK)
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
    ...data.formDataBK
  }
  if (props.curryInfo.id) {
    data.formData.address = props.curryInfo.address
    data.formData.provinceId = parseInt(props.curryInfo.provinceId)
    data.formData.cityId = parseInt(props.curryInfo.cityId)
    data.formData.countyId = parseInt(props.curryInfo.countyId)
    data.formData.townId = parseInt(props.curryInfo.townId) > 0 ? parseInt(props.curryInfo.townId) : null
  }
  setTimeout(() => {
    formRef.value.clearValidate()
  })
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    const { cityName, provinceName, countyName } = data.formData
    const fullAddress = ([provinceName, cityName, countyName].join(',') + ',' + (data.formData.address || '')) as string
    const { id } = props.curryInfo
    const payload: API.T_DingDanChongShiRequest = {
      dataId: id,
      provinceId: data.formData.provinceId,
      cityId: data.formData.cityId,
      countyId: data.formData.countyId,
      townId: data.formData.townId,
      address: fullAddress
    }
    apiLinkProduct
      .A_retrySubmit(payload)
      .then(() => {
        ElMessage.success('操作成功')
        handleClose()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}
</script>
<template>
  <el-dialog v-bind="$attrs" title="重试" class="dialog-m" :destroy-on-close="true" append-to-body @open="openHandler"
    draggable :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="100px">
        <el-form-item label="选择地区" prop="addressInfo">
          <AddressSelect v-model:provinceId="data.formData.provinceId" v-model:provinceName="data.formData.provinceName"
            v-model:cityId="data.formData.cityId" v-model:cityName="data.formData.cityName"
            v-model:townId="data.formData.townId" v-model:countyId="data.formData.countyId"
            v-model:countyName="data.formData.countyName" v-model:townName="data.formData.townName" :openStreet="true">
          </AddressSelect>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="data.formData.address" type="textarea" placeholder="请输入详细地址" row="3"></el-input>
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