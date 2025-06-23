<script setup lang="ts">
import moneyManagement_api from '@/api/moneyManagement/index'
import distributionConstant from '@/utils/constant/distribution'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
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
  formData: API.TFromInstance
  formDataBK: API.TFromInstance
  formRules: FormRules<API.TFromInstance>
  tableFromData: any
  page: any
  submitLoading: boolean
}
const data = reactive<IData>({
  formData: {
    merchantId: null,
    orgId: '',
    businessType: null,
    amount: null,
    images: '',
    remark: ''
  },
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  formDataBK: {} as any,
  formRules: {
    amount: [{ required: true, message: '请输入充值金额', trigger: ['change', 'blur'] }],
    businessType: [{ required: true, message: '请选择业务类型', trigger: ['change', 'blur'] }],
    images: [{ required: true, message: '请上传附件', trigger: ['change', 'blur'] }],
    remark: [{ required: true, message: '请填写充值备注', trigger: ['change', 'blur'] }]
  },
  tableFromData: [],
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
  data.formDataBK = cloneDeep(data.formData)
})
const openHandler = () => {
  data.formData = {
    ...data.formDataBK
  }
  //查询历史充值记录
  queryPrepaidDepositRechargeLog()
}
const queryPrepaidDepositRechargeLog = () => {
  const { page } = data
  const { orgId: merchantNo } = props.curryInfo
  moneyManagement_api.A_queryPrepaidDepositRechargeLog({ ...page, merchantNo }).then(({ page }: any) => {
    data.tableFromData = page.records
    data.page.totalCount = page.totalRow
  })
}

const verifyHandler = (filedName: String) => {
  formRef.value.validateField(filedName)
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    //保存
    data.submitLoading = true
    const { formData } = data
    const { merchantId, orgId } = props.curryInfo
    moneyManagement_api.A_saveRecharge({ ...formData, merchantId, orgId })
      .then(res => {
        ElMessage.success('操作成功！')
        handleClose()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}
const getImageUrl = computed(() => {
  return function (url: string) {
    return url.split(',') || []
  }
})
const changeHandler = (value: any) => {
  if (value > 500000) {
    ElMessage.error('最大充值金额为50万!')
  }
}
</script>
<template>
  <el-dialog v-bind="$attrs" title="充值" width="800px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="recharge-diag">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="100px">
        <el-form-item label="充值金额" prop="amount">
          <el-input-number v-model="data.formData.amount" @change="changeHandler" :precision="2" :controls="false"
            :min="0" :max="500000" />
          <span>&nbsp;&nbsp;元(最大金额为50万)</span>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-radio-group v-model="data.formData.businessType">
            <el-radio v-for="(item, index) in distributionConstant.C_theTypeOfTopUpService" :label="item.value">{{
              item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传附件" prop="images">
          <ImgUpload v-model="data.formData.images" :isArray="false" :limit="5" :maxSize="5 * 1024"
            tip="提示：请保证图片清晰可见，图片大小不超过5M，尺寸为100x100px，格式为png、jpg、jpeg" :acceptList="['png', 'jpg', 'jpeg']" @verify="() => {
              verifyHandler('images')
            }
            "></ImgUpload>
        </el-form-item>
        <el-form-item label="充值备注" prop="remark">
          <el-input v-model="data.formData.remark" type="textarea" maxlength="200" show-word-limit
            placeholder="请输入充值备注" />
        </el-form-item>
      </el-form>
      <div>
        <TableModel :page="data.page" :listTableData="data.tableFromData" max-height="300px"
          @pagingQuery="queryPrepaidDepositRechargeLog">
          <YbtTableColumn label="充值金额" prop="amount" />
          <YbtTableColumn label="充值类型" prop="businessType">
            <template #default="{ row }">{{ distributionConstant.getTheTypeOfTopUpService(row.businessType)
              }}</template>
          </YbtTableColumn>
          <YbtTableColumn label="充值备注" show-overflow-tooltip prop="remark" />
          <YbtTableColumn label="充值时间" prop="createDate" />
          <YbtTableColumn label="附件" width="80" prop="images">
            <template #default="{ row }">
              <el-image v-if="getImageUrl(row.images).length" style="width: 50px; height: 50px"
                :src="getImageUrl(row.images)?.[0] || ''" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                :preview-src-list="getImageUrl(row.images)" show-progress :initial-index="4" fit="cover" />
              <div v-else class="text-center">/</div>
            </template>
          </YbtTableColumn>
        </TableModel>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="mr-10">取消</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.recharge-diag {
  ::v-deep(.table_model_box) {
    min-height: 0 !important;
  }
}
</style>