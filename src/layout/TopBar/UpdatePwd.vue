<script setup lang="ts" name="ForgetPwd">
import user_api from '@/api/system/user'
import { FormInstance, FormRules, messageEmits } from 'element-plus'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { hasNumberAndWord, validatePhone } from '@/utils/validator'
import { useUserStore } from '@/stores/index'
const { userInfo } = storeToRefs(useUserStore())


const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const formRef = ref<FormInstance>()

const passwordValidator = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (!hasNumberAndWord.test(value)) {
    callback(new Error('密码必须包含字母加数字，且处于6-20位之间!'))
  } else {
    if (data.formData.confirmPwd !== '') {
      formRef.value.validateField('confirmPwd')
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
    oldPwd: '',
    newPwd: '',
    confirmPwd: ''
  },
  formRules: {
    oldPwd: [
      { required: true, message: '请输入旧密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    newPwd: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { validator: passwordValidator, trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPwd: [
      { required: true, message: '请再次输入确认密码', trigger: 'blur' },
      { validator: rePasswordValidator, trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ]
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

function handleClose() {
  emits('update:modelValue', false)
  handleReset()
}

//提交
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    const { mobile: phone } = userInfo.value as any
    user_api.A_resetPwd({
      ...data.formData,
      phone
    })
      .then(() => {
        ElMessage.success('密码修改成功！')
        handleReset()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}
</script>
<template>
  <el-dialog v-bind="$attrs" title="修改密码" destroy-on-close :close-on-click-modal="false" @closed="handleReset" draggable
    width="500">
    <el-form ref="formRef" :model="data.formData" :rules="data.formRules" label-width="100px">
      <el-form-item prop="oldPwd" label="旧密码">
        <el-input v-model.trim="data.formData.oldPwd" placeholder="请输入新密码" show-password clearable
          autocomplete="new-password">
          <template #prefix>
            <svg-icon name="password" class="prefix-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="newPwd" label="新密码">
        <el-input v-model.trim="data.formData.newPwd" placeholder="请输入新密码" show-password clearable
          autocomplete="new-password">
          <template #prefix>
            <svg-icon name="password" class="prefix-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPwd" label="确认密码">
        <el-input v-model.trim="data.formData.confirmPwd" placeholder="请输入确认密码" show-password clearable
          autocomplete="new-password">
          <template #prefix>
            <svg-icon name="password" class="prefix-icon" />
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="footer-wrap">
        <el-button @click="handleClose">取消</el-button>
        <el-button :loading="data.submitLoading" type="primary" @click="handleSubmit()"> 提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
