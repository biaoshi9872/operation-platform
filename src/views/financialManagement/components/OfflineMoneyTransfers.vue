<script setup lang="ts">
import moneyManagement_api from '@/api/moneyManagement/index';
import eventBus from '@/utils/eventBus';
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
    images: ''
  },
  formDataBK: {},
  formRules: {
    images: [{ required: true, message: '请上传汇款底单', trigger: ['change', 'blur'] }],
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
  //提交
  formRef.value.validate().then(() => {
    const { amount } = props.curryInfo
    const { images } = data.formData
    moneyManagement_api.A_prepaidDepositRechargeApply({ amount, images }).then((res) => {
      ElMessage.success('操作成功')
      handleClose()
      eventBus.emit('applyFroAtopUpRecordFreshEvent')
    })
  })
}
</script>
<template>
  <el-dialog v-bind="$attrs" title="线下汇款" width="700px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-alert type="error" class="mb-16" :closable="false">
        <template #default>
          <div>1、工作日16:00前完成线下打款，财务将于当日内完成预存款充值。</div>
          <div>2、节假日线下打款，财务将于24小时内完成充值预存款（春节、国庆节除外）。</div>
        </template>
      </el-alert>
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="100px">
        <h3 class="mb-8">请您通过网银转账，或者自行到银行进行汇款，汇款账号如下：</h3>
        <el-form-item label="开户名">
          <span>武汉市驿宝通网络科技有限公司</span>
        </el-form-item>
        <el-form-item label="开户银行">
          <span>招商银行武汉分行南湖支行</span>
        </el-form-item>
        <el-form-item label="银行账号">
          <span>127908554310203</span>
        </el-form-item>
        <h3 class="mb-8">汇款后请填写您汇款的金额及银行交易单号：</h3>
        <el-form-item label="汇款金额">
          <span class="color-red">￥{{ curryInfo.amount }}</span>
        </el-form-item>
        <el-form-item label="入账金额">
          <span class="color-red">￥{{ curryInfo.amount }}</span>
        </el-form-item>
        <el-form-item label="汇款底单" prop="images">
          <div>
            <ImgUpload v-model="data.formData.images" :acceptList="['png', 'jpg', 'jpeg', 'gif', 'bmp']"
              :isArray="false" maxSize="5" limit="5"></ImgUpload>
          </div>
          <div>
            （汇款底单需清晰可见。照片内容真实有效，不得做任何修改。支持.jpg .jpeg .bmp .gif .png格式照片，大小不超过1M。）
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="flex flex-center">
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">我已汇款</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>