<script setup lang="ts" name="ForgetPwd">
import user_api from '@/api/system/user'
import { FormInstance, FormRules, messageEmits } from 'element-plus'
import { ElMessage } from 'element-plus'
import { hasNumberAndWord, validatePhone } from '@/utils/validator'

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
    if (data.formData.confirmPass !== '') {
      formRef.value.validateField('confirmPass')
    }
    callback()
  }
}
const rePasswordValidator = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入确认密码'))
  } else if (!hasNumberAndWord.test(value)) {
    callback(new Error('密码必须包含字母加数字，且处于6-20位之间!'))
  } else if (value !== data.formData.newPass) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
const data = reactive({
  formData: {
    newPass: '',
    confirmPass: '',
    phone: '',
    verificationCode: ''
  },
  formRules: {
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: validatePhone, trigger: 'blur' }
    ],
    verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    newPass: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { validator: passwordValidator, trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPass: [
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
  count.value = 60
  emits('update:modelValue', false)
}

function handleClose() {
  emits('update:modelValue', false)
  handleReset()
}
const disabled = ref(false)
const timer = ref(0)
const count = ref(60)

watch(disabled, () => {
  disabled.value && countDown()
})
function countDown() {
  timer.value = Number(
    setInterval(() => {
      count.value--
      if (count.value === 0) {
        clearInterval(timer.value)
        disabled.value = !disabled.value
        count.value = 60
      }
    }, 1000)
  )
}

async function sendCode() {
  const { phone } = data.formData
  formRef.value.validateField('phone').then(() => {
    try {
      user_api.A_sendVerificationCode({ phone })
      ElMessage.success('短信发送成功！')
      disabled.value = true
    } catch (error) {
    } finally {
    }
  })
}

//提交
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true

    user_api.A_resetPwd({
      ...data.formData
    })
      .then(() => {
        ElMessage.success('密码修改成功！')
        handleReset()
        clearTimeout(timer.value)
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}
</script>
<template>
  <el-dialog v-bind="$attrs" title="忘记密码" destroy-on-close :close-on-click-modal="false" @closed="handleReset" draggable
    width="500">
    <el-form ref="formRef" :model="data.formData" :rules="data.formRules" label-width="100px">
      <el-form-item prop="phone" label="手机号">
        <el-input v-model.trim="data.formData.phone" placeholder="请输入手机号" clearable autocomplete="off" maxlength="11">
          <template #prefix>
            <svg-icon name="user" class="prefix-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="verificationCode" label="验证码">
        <el-input v-model.trim="data.formData.verificationCode" placeholder="请输入验证码" class="w-200" clearable
          autocomplete="off" maxlength="6">
          <template #prefix>
            <svg-icon name="code" class="prefix-icon" />
          </template>
        </el-input>
        <el-button v-if="!disabled" type="primary" @click="sendCode" class="ml-10" plain>获取验证码</el-button>
        <el-button v-if="disabled" type="primary" :disabled="true" class="ml-10" plain>{{ count }}s后重新发送</el-button>
      </el-form-item>
      <el-form-item prop="newPass" label="新密码">
        <el-input v-model.trim="data.formData.newPass" placeholder="请输入新密码" show-password clearable
          autocomplete="new-password">
          <template #prefix>
            <svg-icon name="password" class="prefix-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPass" label="确认密码">
        <el-input v-model.trim="data.formData.confirmPass" placeholder="请输入确认密码" show-password clearable
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
