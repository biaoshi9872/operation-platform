<script setup lang="ts">
import goods_api from '@/api/goods'
import application_api from '@/api/system/application'
import { validateEmail, validatePhone } from '@/utils/validator'
import { ElMessage, FormInstance } from 'element-plus'
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
  goodsTypeList: any[]
  tableFromData: any
  submitLoading: boolean
}
const data = reactive<IData>({
  formData: {
    appName: '',
    goodsSourceTypeCodeList: [],
    orgId: '',
    isSupportMask: false,
    developerEmail: '',
    developerPhone: ''
  },
  goodsTypeList: [],
  formDataBK: {},
  formRules: {
    appName: [{ required: true, message: '请输入应用名称', trigger: ['change', 'blur'] }],
    goodsSourceTypeCodeList: [{ required: true, message: '请选择可见商品类型', trigger: ['change', 'blur'] }],
    orgId: [{ required: true, message: '请选择分支机构', trigger: ['change', 'blur'] }],
    isSupportMask: [{ required: true, message: '请选择是否支持脱敏', trigger: ['change', 'blur'] }],
    developerEmail: [
      { required: true, message: '请输入开发者邮箱', trigger: ['change', 'blur'] },
      {
        validator: validateEmail,
        trigger: 'blur'
      }
    ],
    developerPhone: [
      { required: true, message: '请输入开发者手机', trigger: ['change', 'blur'] },
      {
        validator: validatePhone,
        trigger: 'blur'
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
  if (props.curryInfo?.id) {
    getDetail()
  }
}

const getDetail = () => {
  let appId = props.curryInfo?.id
  application_api.A_applicationDetail({ appId }).then((res: any) => {
    data.formData = {
      ...data.formDataBK,
      ...res,
      goodsSourceTypeCodeList: res?.goodsSourceTypeCodeList?.split(',').map((el: any) => Number(el))
    }
  })
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    let goodsSourceTypeCodeList = data.formData.goodsSourceTypeCodeList.join(',')
    application_api
      .A_save({ ...data.formData, goodsSourceTypeCodeList, id: props.curryInfo?.id || null })
      .then(() => {
        ElMessage.success('操作成功!')
        handleClose()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}
const title = computed(() => {
  return props.curryInfo?.id ? '编辑应用' : '新增应用'
})

watch(
  () => data.formData.orgId,
  val => {
    if (val) {
      getGoodTypeList()
    }
  },
  {
    immediate: true,
    deep: true
  }
)
const goodsSourceChangeHandler = (val: any) => {
  if (!val.includes(104)) {
    data.formData.isSupportMask = null
  }
}
const changeHandler = () => {
  data.formData.goodsSourceTypeCodeList = []
}
const getGoodTypeList = () => {
  goods_api.A_goodsSourceByOrg({ orgId: data.formData.orgId }).then((res: any) => {
    data.goodsTypeList = res
  })
}
</script>
<template>
  <el-dialog v-bind="$attrs" :title="title" width="500px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="140px">
        <el-form-item label="分支机构" prop="orgId">
          <OrgSelect :disabled="props.curryInfo?.id" v-model="data.formData.orgId" :multiple="false"
            @change="changeHandler"></OrgSelect>
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="data.formData.appName" placeholder="请输入应用名称" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="开发者邮箱" prop="developerEmail">
          <el-input v-model="data.formData.developerEmail" placeholder="请输入开发者邮箱" maxlength="50"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="开发者手机" prop="developerPhone">
          <el-input v-model="data.formData.developerPhone" placeholder="请输入开发者手机" maxlength="11"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item v-if="data.goodsTypeList.length" label="可见商品类型" prop="goodsSourceTypeCodeList">
          <el-checkbox-group v-model="data.formData.goodsSourceTypeCodeList" @change="goodsSourceChangeHandler">
            <el-checkbox v-for="item in data.goodsTypeList" :label="item.sourceName" :value="item.id" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="data.formData.goodsSourceTypeCodeList?.includes(104)" label="是否支持脱敏" prop="isSupportMask">
          <template #label>
            <Tooltip content="选择“是”，则API商品池仅展示支持脱敏的驿宝通精选商品;反之，则展示全量驿宝通精选商品。">是否支持脱敏</Tooltip>
          </template>
          <el-radio-group v-model="data.formData.isSupportMask">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="mr-10">取消</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>