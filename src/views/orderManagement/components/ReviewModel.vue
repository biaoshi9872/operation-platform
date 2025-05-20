<script setup lang="ts">
import { ElMessage, FormInstance, FormRules, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
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
    stockNum: ''
  },
  formDataBK: {},
  formRules: {
    stockNum: [{ required: true, message: '请输入商品数量', trigger: ['change', 'blur'] }]
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
    if (1 == 1) {
      ElMessageBox.confirm(`输入的退用户金额大于售后商品金额+订单运费之和，是否确认进行该操作?`, '售后确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {})
    }
  })
}
</script>
<template>
  <el-dialog
    v-bind="$attrs"
    title="售后确认"
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
        <el-form-item label="审核" prop="stockNum">
          <el-radio-group v-model="data.formData.stockNum">
            <el-radio label="通过"></el-radio>
            <el-radio label="不通过"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分销价" prop="stockNum">20元</el-form-item>
        <el-form-item label="退用户" prop="stockNum">
          <el-input-number v-model="data.formData.stockNum" placeholder="请输入退用户" :precision="2" :min="0" :max="999999999"></el-input-number>元
        </el-form-item>
        <el-form-item label="处理意见" prop="stockNum">
          <el-input v-model="data.formData.stockNum" placeholder="售后处理意见，展示给前端用户" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="客服备注" prop="stockNum">
          <el-input v-model="data.formData.stockNum" placeholder="客户其他备注，将留存在售后详情" maxlength="200" show-word-limit></el-input>
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