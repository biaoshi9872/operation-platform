<script setup lang="ts">
import exportTemplate_api from '@/api/exportTemplate/index';
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
  templateTypeList: any,
  tableFromData: any,
  submitLoading: boolean,
}
const data = reactive<IData>({
  formData: {
    templateType: '',
    fileName: '',
    ossUrl: ''
  },
  templateTypeList: [],
  formDataBK: {},
  formRules: {
    templateType: [{ required: true, message: '请选择导入模板类型', trigger: ['change', 'blur'] }],
    fileName: [{ required: true, message: '请输入导入模板名称', trigger: ['change', 'blur'] }],
    ossUrl: [{ required: true, message: '请输入导入模板ossUrl', trigger: ['change', 'blur'] }],
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
    ...data.formDataBK,
    ...props.curryInfo
  }
  templateTypeList()
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    const { id } = props.curryInfo
    exportTemplate.A_saveExcelTemplate({ id, ...data.formData }).then(res => {
      ElMessage.success('操作成功！')
      handleClose()
    }).finally(() => {
      data.submitLoading = false
    })
  })
}

const templateTypeList = () => {
  exportTemplate_api.A_templateTypeList().then((res: any) => {
    data.templateTypeList = Object.keys(res).map((el => {
      return {
        desc: res[el],
        value: el
      }
    }))
  })
}

const callBackHandler = (res: any) => {
  console.log(res, 'res')
  const obj = res.data[0]
  if (obj) {
    data.formData.fileName = obj.fileName
    data.formData.ossUrl = obj.ossUrl
  }
}

const disabled = computed(() => {
  return !!props.curryInfo?.id
})

</script>
<template>
  <el-dialog v-bind="$attrs" title="导入模板设置" width="500px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="100px">
        <el-form-item label="模板类型" prop="templateType">
          <el-select v-model="data.formData.templateType" :disabled="disabled">
            <el-option v-for="(item, index) in data.templateTypeList" :label="item.desc"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="fileName">
          <el-input v-model="data.formData.fileName"></el-input>
        </el-form-item>
        <el-form-item label="ossUrl" prop="ossUrl">
          <el-input v-model="data.formData.ossUrl"></el-input>
        </el-form-item>
        <el-form-item>
          <ImportButton importExcelApi="/open-platform/system/oss/upload" @callBack="callBackHandler">手动导入
          </ImportButton>
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