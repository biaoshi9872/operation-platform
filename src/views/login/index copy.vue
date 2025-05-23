<script setup lang="ts" name="Login">
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import login_api from '@/api/system/login'
import { getUUID } from '@/utils'
import { useUserStore } from '@/stores'
import isEevCheckHooks from '@/hooks/isEevCheckHooks'
import CaptchaBoxDialog from './CaptchaBoxDialog.vue'
const { isDevelopment } = isEevCheckHooks({})
const userStore = useUserStore()
const $router = useRouter()
interface FromData {
  username: string
  pwd: string
  uuid: string
  captcha: string
}

const $route = useRoute()
const formRef = ref<FormInstance>()
const formData = reactive<FromData>({
  username: '',
  pwd: '',
  uuid: '',
  captcha: ''
})
const loading = ref(false)

const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: '请输入登录账号',
      trigger: 'blur'
    }
  ],
  pwd: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ]
})

async function handleFinish() {
  // try {
  //   await formRef.value!.validate().then(() => {
  //     captchaShow.value = true
  //   })
  // } catch (error) {
  //   return
  // }
  handleCaptchaSuccess()
}
const updateShow = ref(false)

function handleForgetPwd() {
  updateShow.value = true
}
//显示滑块
let captchaShow = ref(false)

//验证通过
const handleCaptchaSuccess = async () => {
  loading.value = true
  try {
    const res: any = await login_api.A_login({ ...formData })
    
    // 登录成功后 更新用户信息
    userStore.updateUserInfo(res)
    userStore.initInfo()
    ElMessage.success('登录成功')
    setTimeout(() => {
      location.reload()
    }, 1000)
  } catch {
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page" @keyup.enter="handleFinish">
    <div class="login-form-container">
      <div class="login-form">
        <el-form ref="formRef" :model="formData" :rules="rules" class="form-wrap">
          <h2 class="lh-33 fs-21 fw-400 text-center color-#8E9198 mb-20">您好！欢迎登录</h2>
          <h2 class="lh-33 fs-35 fw-500 text-center mb-30">供应链开放平台</h2>
          <el-form-item prop="username">
            <el-input v-model.trim="formData.username" clearable placeholder="请输入登录账号">
              <template #prefix>
                <svg-icon name="user" class="prefix-icon" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model.trim="formData.pwd" show-password clearable type="passWord" placeholder="请输入密码">
              <template #prefix>
                <svg-icon name="password" class="prefix-icon" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" class="submit-btn" @click="handleFinish">登 录</el-button>
          </el-form-item>
          <el-form-item>
            <div class="flex flex-center w-100%">
              <el-link type="primary" :underline="false" @click="handleForgetPwd">忘记密码?</el-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <ForgetPwd v-model="updateShow" />
    <CaptchaBoxDialog v-model="captchaShow" @validSuccess="handleCaptchaSuccess"></CaptchaBoxDialog>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  width: 100%;
  background: url('./img/bgImg2.png') no-repeat center / cover;
  display: flex;
  justify-content: flex-end;

  .login-form-container {
    width: 38%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-form {
      width: 384px;
      display: flex;
      justify-content: center;
      justify-items: center;
      flex-direction: column;
    }

    .form-wrap {
      width: 384px;
      // background: #ffffff;
      // border-radius: 2px 2px 2px 2px;
      box-sizing: border-box;
      padding: 56px 35px;
      border-radius: 10px;

      .prefix-icon {
        font-size: 20px;
        color: #0076ff;
      }

      .code-input {
        width: 182px;
      }

      .submit-btn {
        margin-top: 16px;
        width: 100%;
        height: 48px;
        border-radius: 2px;
      }

      :deep(.el-input__inner) {
        height: 48px;
      }
    }
  }
}
</style>
