<script setup lang="ts">
import role_api from '@/api/system/role'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import system_num from '@/utils/constant/system'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { onMounted, reactive, ref } from 'vue'
const { isOrgLast } = isStateCheckHooks()


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
    id: '',
    parentId: '',
    roleName: '',
    orgType: '',
  },
  formDataBK: {},
  formRules: {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    orgType: [{ required: true, message: '请选择机构类型', trigger: 'blur' }]
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
    data.formData = {
      ...data.formDataBK,
    }
    data.formData.roleName = props.curryInfo.name
    data.formData.orgType = props.curryInfo.createRoleType
  }
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    role_api.A_roleSave({
      ...data.formData,
      id: props.curryInfo?.id
    }).then((res: any) => {
      ElMessage({
        message: `操作成功`,
        type: 'success'
      })
      handleClose()
    }).finally(() => {
      data.submitLoading = false
    })
  })
}

const title = computed(() => {
  return props.curryInfo?.id ? '编辑角色' : '新增角色'
})

</script>
<template>
  <el-dialog v-bind="$attrs" :title="title" width="500px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="data.formData.roleName" placeholder="请输入角色名称" maxlength="20" show-word-limit clearable
            class="w-248" />
        </el-form-item>
        <el-form-item label="机构类型" v-if="!isOrgLast && !props.curryInfo?.id" prop="orgType">
          <el-select v-model="data.formData.orgType" class="w-248" placeholder="请选择机构类型">
            <el-option v-for="(item, index) in system_num.orgType" :key="index" :label="item.label"
              :value="item.value" />
          </el-select>
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