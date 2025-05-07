<script setup lang="ts" name="ResetPassword">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { PropType } from 'vue'
import { hasNumberAndWord } from '@/utils/validator'
import user_api from '@/api/system/user'

const props = defineProps({
  userId: {
    type: Object as PropType<string | number | null | undefined>
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
const form :any = ref<FormInstance>()

const passwordValidator = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (!hasNumberAndWord.test(value)) {
    callback(new Error('密码必须包含字母加数字，且处于6-20位之间!'))
  } else {
    if (data.formData.confirmPassword !== '') {
      form.value.validateField('confirmPassword')
    }
    callback()
  }
}

const rePasswordValidator = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入确认密码'))
  } else if (!hasNumberAndWord.test(value)) {
    callback(new Error('密码必须包含字母加数字，且处于6-20位之间!'))
  } else if (value !== data.formData.newPwd) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
const data = reactive({
  formData: {
    newPwd: '',
    confirmPassword: ''
  },
  formRules: {
    newPwd: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { validator: passwordValidator, trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入确认密码', trigger: 'blur' },
      { validator: rePasswordValidator, trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ]
  },
  submitLoading: false
})

const { formData, submitLoading, formRules } = toRefs(data)

// 重置
function handleReset() {
  if (form.value) {
    form.value.resetFields()
  }
  emits('update:modelValue', false)
}
// 提交
function handleSubmit() {
  submitLoading.value = true
  form.value
    .validate()
    .then(() => {
      const { newPwd } = formData.value as any
      return user_api.A_resetPwd({
        newPwd,
        id: <number>props.userId
      })
    })
    .then(() => {
      ElMessage({
        message: '修改密码成功',
        type: 'success'
      })
      handleClose()
    })
    .finally(() => {
      submitLoading.value = false
    })
}
// 关闭
function handleClose() {
  emits('update:modelValue', false)
}
</script>

<template>
  <el-dialog v-bind="$attrs" width="500px" title="重置密码" destroy-on-close :close-on-click-modal="false" @closed="handleReset" draggable>
    <el-form ref="form" label-width="140px" label-suffix="：" :model="formData" :rules="formRules">
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="formData.newPwd" placeholder="请输入6位数以上字母+数字密码" show-password clearable maxlength="20" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="formData.confirmPassword" placeholder="请输入6位数以上字母+数字密码" show-password clearable maxlength="20" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="footer-wrap">
        <el-button @click="handleClose">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmit()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
