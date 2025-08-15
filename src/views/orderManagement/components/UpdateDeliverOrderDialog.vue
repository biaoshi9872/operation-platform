<script setup lang="ts">
import { FormInstance, ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import systemUtils_api from '@/api/system/systemUtils'
import { validatePhone } from '@/utils/validator';
interface IProp {
  deliverInfo: any
}
const props = withDefaults(defineProps<IProp>(), {
  deliverInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any
interface IData {
  formDelivery: any
  formDataBK: any
  formRules: any
  formDeliveryList: any
  submitLoading: boolean
}

const data = reactive<IData>({
  formDelivery: {
    expressCompanyCode: '',
    expressCompanyName: '',
    expressCode: ''
  },
  formDeliveryList: [],
  formDataBK: {},
  formRules: {
    expressCompanyCode: [{ required: true, message: '请选择物流公司', trigger: ['change', 'blur'] }],
    expressCode: [{ required: true, message: '请输入快递单号', trigger: ['change', 'blur'] }],
    mobile: [{ required: true, message: '请填写联系方式', trigger: 'blur' }, { validator: validatePhone }]
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
  searchQueryHandler()
  emits('update:modelValue', false)
}
const searchQueryHandler = inject('searchQueryHandler', () => { })

onMounted(() => {
  data.formDataBK = cloneDeep(data.formDelivery)
})
const openHandler = () => {
  data.formDelivery = {
    ...data.formDataBK
  }
  data.formDelivery.expressCompanyCode = props.deliverInfo.expressCompanyCode
  data.formDelivery.expressCompanyName = props.deliverInfo.expressCompanyName
  data.formDelivery.expressCode = props.deliverInfo.expressCode
  data.formDelivery.expressCompanyName = props.deliverInfo.expressCompanyName
  queryComList()
}

const deliveryType = computed(() => props.deliverInfo.deliveryType)

const handleSubmit = () => {
  const { packageId, outgoingCode, deliverGoodsList } = props.deliverInfo
  const detailIdSet = deliverGoodsList.map((el: any) => el.id)
  formRef.value.validate().then(() => {
    data.submitLoading = true
    systemUtils_api.A_updateExpress({ packageId, outgoingCode, deliveryType: deliveryType.value, detailIdSet, ...data.formDelivery })
      .then(() => {
        ElMessage.success('操作成功！')
        handleClose()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}

const getExpressHandler = (value: any) => {
  const obj = formDeliveryList.value.find((el: any) => el.expressCompanyCode == value)
  data.formDelivery = {
    ...data.formDelivery,
    ...obj
  }
}

const queryComList = () => {
  systemUtils_api.A_getLogisticList({}).then((res: any) => {
    data.formDeliveryList = res?.map((item: any) => {
      return {
        expressCompanyCode: item.companyCode,
        expressCompanyName: item.companyName
      }
    })
  })
}

const { submitLoading, formDelivery, formDeliveryList, formRules } = toRefs(data)
</script>

<template>
  <el-dialog :title="deliveryType == '1' ? '修改物流' : '修改手机号'" v-bind="$attrs" width="400px" :close-on-click-modal="false"
    @close="handleClose" @open="openHandler">
    <el-form ref="formRef" :model="formDelivery" class="formPanel" :rules="formRules">
      <template v-if="deliveryType == '1'">
        <el-form-item label="物流公司" class="formItem" prop="expressCompanyCode" label-width="80px">
          <el-select clearable v-model="formDelivery.expressCompanyCode" class="w-150" filterable placeholder="全部"
            @change="getExpressHandler">
            <el-option v-for="(item, index) in formDeliveryList" :key="index" :label="item.expressCompanyName"
              :value="item.expressCompanyCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressCode" label-width="80px">
          <div class="tip">
            <el-input clearable v-model="formDelivery.expressCode" maxlength="20" class="w-150" placeholder="请填写快递单号" />
          </div>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="配送电话:" prop="mobile" label-width="110px">
          <div class="tip">
            <el-input clearable v-model="formDelivery.mobile" maxlength="11" show-word-limit class="w-150"
              placeholder="请填配送电话" />
          </div>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>