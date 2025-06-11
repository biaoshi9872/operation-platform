<script setup lang="ts">
import good_api from '@/api/goods';
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
interface Idata {
  formData: any
  formRules: any
  submitLoading: boolean
}
const data = reactive<Idata>({
  formData: {
    stock: null
  },
  formRules: {
    stock: [{ required: true, message: '请输入库存数量', trigger: ['change', 'blur'] }]
  },
  submitLoading: false
})

//重置
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  emits('update:modelValue', false)
}
//关闭
const handleClose = () => {
  emits('update:modelValue', false)
  handleReset()
}

onMounted(() => {
  data.formData = cloneDeep(data.formData)
})
const openHandler = () => {
  data.formData = {
    ...data.formData
  }
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    const skuCode = props.curryInfo.skuCode
    good_api.A_updStock({ ...data.formData, skuCode }).then((res: any) => {
      ElMessage.success('修改成功')
      handleClose()
      emits('refresh')
    }).finally(() => {
      data.submitLoading = false
    })
  })
}

</script>
<template>
  <el-dialog v-bind="$attrs" title="库存修改" width="400px" modal-class="stock_num_content" @open="openHandler" draggable
    destroy-on-close :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-alert title="提交成功后，库存数量将直接更新。" type="warning" show-icon :closable="false" class="mb-8" />
      <el-form ref="formRef" :model="data.formData" :rules="data.formRules" label-width="120px">
        <el-form-item label="库存数量修改为" prop="stock">
          <el-input-number v-model="data.formData.stock" :min="0" :precision="0" :max="999999999" :step="1"
            :controls="false" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer flex-center">
        <el-button @click="handleClose" class="mr-10">取消</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
