<template>
  <div class="layout">
    <div class="logo">
      <img src="./img/logo.png" alt="logo" />
    </div>
    <div class="user-info">
      <el-form ref="formRef" :model="formData" :rules="rules" class="form-wrap">
        <h2 class="title">供应链开放平台</h2>
        <el-form-item prop="username">
          <el-input v-model.trim="formData.username" class="input" clearable placeholder="请输入登录账号">
            <template #prefix>
              <svg-icon name="user" class="prefix-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="pwd" class="pwd">
          <el-input v-model.trim="formData.pwd" class="input" show-password clearable type="passWord" placeholder="请输入密码">
            <template #prefix>
              <svg-icon name="password" class="prefix-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="submit-btn-option">
          <el-button type="primary" :loading="loading" class="submit-btn" @click="handleFinish">登 录</el-button>
        </el-form-item>
        <el-form-item>
          <div class="flex flex-center w-100%">
            <el-link type="primary" class="ford" :underline="false" @click="handleForgetPwd">忘记密码?</el-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import login_api from '@/api/system/login'
import isEevCheckHooks from '@/hooks/isEevCheckHooks'
import { useUserStore } from '@/stores'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
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

const designWidth = 1920
// 基准字体大小（建议取设计稿宽度的1/100，便于计算）
const baseFontSize = 19.2
function setRootFontSize() {
  const clientWidth = document.documentElement.clientWidth
  // 计算当前根字体大小
  let fontSize = (clientWidth / designWidth) * baseFontSize

  // 限制最小字体（避免过小）和最大容器宽度（避免过大屏拉伸）
  fontSize = Math.max(fontSize, 12) // 最小12px
  if (clientWidth > 1920) {
    fontSize = 19.2 // 大屏保持基准大小
  }

  document.documentElement.style.fontSize = `${fontSize}px`
}
// 初始化执行
setRootFontSize()
// 监听窗口变化
window.addEventListener('resize', setRootFontSize)
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  min-width: 100vw;
  background: url('./img/bg.png') no-repeat 100% 100% / cover;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10.31rem;
  .logo {
    img {
      width: 41.3rem;
      height: 38.07rem;
    }
  }
  .user-info {
    width: 25.05rem;
    height: 23.96rem;
    background: linear-gradient(0deg, #ffffff 0%, #ffffff 100%);
    box-shadow: 0rem 0rem 1rem 0rem rgba(182, 211, 255, 0.59);
    border-radius: 0.42rem;
    padding: 0 2.55rem;
    .title {
      font-family: MiSans;
      font-weight: 500;
      font-size: 1.35rem;
      color: #333333;
      line-height: 2.5rem;
      margin-top: 2.76rem;
      margin-bottom: 2.08rem;
      text-align: center;
    }
    ::v-deep(.el-form-item) {
      margin-bottom: 1.41rem;
    }
    .input {
      height: 2.55rem;
    }
    .submit-btn-option {
      margin-top: 2.29rem !important;
      margin-bottom: 0.99rem;
    }
    .prefix-icon {
      margin-left: 0.6rem;
      font-size: 1rem;
      color: #517aee;
    }
    .submit-btn {
      width: 100%;
      height: 2.92rem;
      font-family: MiSans;
      font-weight: 400;
      font-size: 1.25rem;
      color: #ffffff;
      line-height: 2.92rem;
    }
    .ford {
      font-family: MiSans;
      font-weight: 400;
      font-size: 1rem;
      color: #7b7e8b;
      line-height: 2.5rem;
    }
  }
}
</style>
