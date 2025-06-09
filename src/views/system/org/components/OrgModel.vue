<script setup lang="ts">
import org_api from '@/api/system/org'
import { hasNumberAndWord, validatePhone } from '@/utils/validator'
import { ElMessage, FormInstance } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import ProductMarkUpSet from './ProductMarkUpSet.vue'

interface IProp {
  curryInfo: any
  type: any
}
const props = withDefaults(defineProps<IProp>(), {
  curryInfo: {},
  type: 'edit'
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
  [T: string]: any
}
const passwordValidator = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (!hasNumberAndWord.test(value)) {
    callback(new Error('密码必须包含字母加数字，且处于6-20位之间!'))
  } else {
    callback()
  }
}
const data = reactive<IData>({
  formData: {
    id: null,
    name: '',
    parentOrgId: null,
    status: 1,
    customerName: '',
    projectManagerPhone: '',
    validateStartTime: null,
    validateEndTime: null,
    remark: null,
    relationPerson: null,
    relationPhone: null,
    relationProvinceId: null,
    relationCityId: null,
    relationCountryId: null,
    relationDetailAddress: null,
    licenseNumber: null,
    companyLegalPerson: null,
    attachment: '',
    username: null,
    password: null,
    mobile: null,
    goodsOrgMarkupDTOList: []
  },
  formDataBK: {},
  formRules: {
    name: [{ required: true, message: '请输入机构名称', trigger: ['change', 'blur'] }],
    customerName: [{ required: true, message: '请输入客户名称', trigger: ['change', 'blur'] }],
    projectManagerPhone: [
      { required: true, message: '请输入项目经理电话', trigger: ['change', 'blur'] },
      {
        validator: validatePhone,
        trigger: 'blur'
      }
    ],
    validateStartTime: [{ required: true, message: '请输入有效期', trigger: ['change', 'blur'] }],
    relationProvinceId: [{
      required: true, message: '请选择省市区', trigger: ['change', 'blur'],
      validator: (rule: any, value: any, callback: any) => {
        if (data.formData.relationProvinceId && data.formData.relationCityId && data.formData.relationCountryId) {
          callback()
        } else {
          callback(new Error('请选择省市区'))
        }
      }
    }],
    username: [{ required: true, message: '请输入管理员账号', trigger: ['change', 'blur'] }],
    password: [
      { required: true, message: '请输入登录密码', trigger: ['change', 'blur'] },
      {
        validator: passwordValidator,
        trigger: 'blur'
      }
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: ['change', 'blur'] },
      {
        validator: validatePhone,
        trigger: 'blur'
      }
    ],
    relationPerson: [{ required: true, message: '请输入联系人', trigger: ['change', 'blur'] }],
    relationPhone: [
      { required: true, message: '请输入手机号', trigger: ['change', 'blur'] },
      {
        validator: validatePhone,
        trigger: 'blur'
      }
    ]
  },
  activeName: '1',
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
const searchQueryHandler = inject('searchQueryHandler', () => { })
onMounted(() => {
  data.formDataBK = cloneDeep(data.formData)
})
const productMarkUpSetRef: any = ref(null)
const openHandler = async () => {
  data.formData = {
    ...data.formDataBK
  }
  if (props.type == 'edit') {
    const res: any = await getOrgDetail()
    data.formData = {
      ...data.formData,
      ...res
    }
    data.activeName = '2'
  }
  productMarkUpSetRef.value?.initProductMarkUpSet(data.formData?.goodsOrgMarkupDTOList || [])
}

const getOrgDetail = () => {
  return org_api.A_getOrgDetail(props.curryInfo?.id)
}

const handleSubmit = async () => {
  const res = await productMarkUpSetRef.value?.validateInfo()
  formRef.value
    .validate((val: any) => {
      if (val) {
        const goodsOrgMarkupDTOList = productMarkUpSetRef.value?.getSubmitData() || []
        data.submitLoading = true
        org_api
          .A_save({ ...data.formData, goodsOrgMarkupDTOList, id: props.type == 'edit' ? props.curryInfo?.id : null })
          .then(res => {
            ElMessage.success('操作成功')
            handleClose()
          })
          .catch(() => {
            data.submitLoading = false
          })
          .finally(() => {
            data.submitLoading = false
          })
      } else {
        ElMessage.error('请检查填写内容')
      }
    })

}
const title = computed(() => {
  return props.type == 'edit' ? '修改机构' : '新增机构'
})
</script>
<template>
  <el-dialog v-bind="$attrs" :title="title" width="800px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="160px">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="data.formData.name" placeholder="请输入机构名称" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="data.formData.customerName" placeholder="请输入客户名称" maxlength="50"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="项目经理电话" prop="projectManagerPhone">
          <el-input v-model="data.formData.projectManagerPhone" placeholder="请输入项目经理电话" maxlength="11"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="validateStartTime">
          <DatePickerRange v-model:start="data.formData.validateStartTime" v-model:end="data.formData.validateEndTime">
          </DatePickerRange>
        </el-form-item>
        <el-form-item label="机构状态">
          <el-radio-group v-model="data.formData.status">
            <el-radio :value="1" :name="1">正常</el-radio>
            <el-radio :value="0" :name="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.formData.remark" :rows="2" type="textarea" placeholder="请输入备注" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="可见商品及加价设置" required>
          <ProductMarkUpSet ref="productMarkUpSetRef"></ProductMarkUpSet>
        </el-form-item>
        <div>
          <el-tabs v-model="data.activeName" type="card" class="demo-tabs">
            <el-tab-pane v-if="props.type != 'edit'" label="账号管理" name="1">
              <el-form-item label="管理员账号" prop="username">
                <el-input v-model="data.formData.username" placeholder="请输入管理员账号" maxlength="50"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="data.formData.password" placeholder="请输入6位数以上字母+数字密码" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="data.formData.mobile" placeholder="请输入手机号" maxlength="11" show-word-limit></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="联系方式" name="2">
              <el-form-item label="联系人" prop="relationPerson">
                <el-input v-model="data.formData.relationPerson" placeholder="请输入联系人" maxlength="20"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="relationPhone">
                <el-input v-model="data.formData.relationPhone" placeholder="请输入手机号" maxlength="11"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="省市区" prop="relationProvinceId">
                <AddressSelect v-model:provinceId="data.formData.relationProvinceId"
                  v-model:cityId="data.formData.relationCityId" v-model:countyId="data.formData.relationCountryId">
                </AddressSelect>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="data.formData.relationDetailAddress" :rows="2" type="textarea" placeholder="请输入详细地址"
                  maxlength="200" show-word-limit></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="资质附件" name="3">
              <el-form-item label="营业执照号">
                <el-input v-model="data.formData.licenseNumber" placeholder="请输入营业执照号" maxlength="20"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="公司法人">
                <el-input v-model="data.formData.companyLegalPerson" placeholder="请输入公司法人" maxlength="20"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="资质附件">
                <ImgUpload v-model="data.formData.attachment" :limit="5"
                  :acceptList="['bmp', 'png', 'jpg', 'jpeg', 'pdf']" :maxSize="5" :isArray="false"
                  tip="图片不能超过5MB,支持扩展名：bmp,png,jpg,jpeg,pdf(最多可上传5张)"></ImgUpload>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </div>
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