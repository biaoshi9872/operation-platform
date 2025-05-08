<script setup lang="ts" name="EditUser">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { validatePhone } from '@/utils/validator'
import role_api from '@/api/system/role'
import user_api from '@/api/system/user'

const props = defineProps({
  curUser: {
    type: Object,
    require: true
  },
  curDepartment: {
    type: Object ,
    require: true
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update'): void
}>()

const form:any = ref<FormInstance>()

const isAdd = computed(() => {
  return !props.curUser
})

const submitLoading = ref(false)
const formData = reactive<any>({
  id: '',
  username: '',
  mobile: '',
  photo: '',
  name: '',
  orgId: null,
  roleIds: null,
  status: 1,
  password: '',
  rePassword: ''
})

function passwordValidator(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入登录密码'))
  } else {
    if (formData.rePassword !== '') {
      form.value.validateField('rePassword')
    }
    callback()
  }
}
function rePasswordValidator(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请再次输入登录密码'))
  } else if (String(value) !== formData.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const formRules = reactive<FormRules<any>>({
  username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: validatePhone,
      trigger: 'blur'
    }
    // { pattern: /^1[3-9]{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { validator: passwordValidator, trigger: 'blur' },
    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
  ],
  rePassword: [
    { required: true, message: '请再次输入登录密码', trigger: 'blur' },
    { validator: rePasswordValidator, trigger: 'blur' },
    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
  ],
  roleIds: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择用户状态', trigger: 'change' }]
})

const roleList = ref<any>()

function fetchRoleList() {
  role_api.A_addUserRoleList({orgId: props.curDepartment?.id}).then((data: any) => {
    roleList.value = data as any[]
  })
}

function handleOpen() {
  const { curUser } = props as any
  if (props.curUser?.id) {
    A_detail()
  } else {
    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })
    // 状态模块
    formData.status = 1
    formData.id = ''
    nextTick(() => {
      handleReset()
    })
  }
  fetchRoleList()
}

const A_detail=()=>{
  user_api.A_detail(props.curUser?.id ).then(res=>{
    console.log(res)
    Object.keys(formData).forEach(key => {
      if (Object.hasOwn(res, key)) formData[key] = res[key] ?? ''
    })
    formData.roleIds = res.roleInfoList.map((el:any)=>el.id) ||[]
  })
}

// 初始化 dialog 数据，恢复表单数据，清除表单校验等
function handleReset() {
  if (form.value) {
    form.value.resetFields()
  }
}

function handleSubmit() {
  form.value
    .validate()
    .then(() => {
      const dataObj = {
        ...formData,
        orgId: props.curDepartment?.id
      } as any
      if (!isAdd.value) {
        delete dataObj.password
      }
      delete dataObj.rePassword
      submitLoading.value = true 
      const api = isAdd.value ? user_api.A_addUser : user_api.A_updateUser
      api(dataObj).then(()=>{
        ElMessage({
        message: `${isAdd.value ? '新增' : '编辑'}用户成功`,
        type: 'success'
      })
      handleClose()
      emits('update')
      }).finally(() => {
        submitLoading.value = false
      })
    })
    
}
function handleClose() {
  emits('update:modelValue', false)
  handleReset()
}
</script>

<template>
  <el-dialog
    v-bind="$attrs"
    :title="`${isAdd ? '新增' : '编辑'}用户`"
    destroy-on-close
    :close-on-click-modal="false"
    @open="handleOpen"
    @closed="handleClose"
    draggable
    width="500px"
  >
    <el-form ref="form" label-width="140px" label-suffix="：" :model="formData" :rules="formRules">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model.trim="formData.username" maxlength="50" class="w-300" show-word-limit placeholder="请输入用户账号" clearable />
      </el-form-item>
      <el-form-item label="用户姓名" prop="name">
        <el-input v-model.trim="formData.name" maxlength="50" class="w-300" show-word-limit placeholder="请输入用户姓名" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" maxlength="11" show-word-limit class="w-300" clearable />
      </el-form-item>
      <el-form-item v-if="isAdd" label="登录密码" prop="password">
        <el-input v-model.trim="formData.password" maxlength="50" class="w-300" placeholder="请输入6位数以上字母+数字密码" clearable />
      </el-form-item>
      <el-form-item v-if="isAdd" label="确认密码" prop="rePassword">
        <el-input v-model.trim="formData.rePassword" maxlength="50" class="w-300" placeholder="请输入6位数以上字母+数字密码" clearable />
      </el-form-item>
      <el-form-item label="用户角色" prop="roleIds">
        <el-select v-model="formData.roleIds" multiple filterable placeholder="请选择用户角色" class="w-300">
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label>
        <p class="formTip">
          1.创建用户成功后，用户账号自动作为登录账号
          <br />2.用户角色与权限挂钩，请谨慎选择
        </p>
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
