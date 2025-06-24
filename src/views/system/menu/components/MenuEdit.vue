<script setup lang="ts" name="EditRole">
import menu_api from '@/api/system/menu'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  isAdd: {
    type: Boolean,
    default: false
  },
  current: {
    type: Object as PropType<any | null | undefined>,
    default: () => { }
  },
  menuType: {
    type: Number,
    default: 1
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update'): void
}>()

const form = ref<FormInstance>()

const data = reactive({
  formRules: {
    name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    erpFlag: [{ required: true, message: '必填项不能为空', trigger: ['blur', 'change'] }]
  },
  submitLoading: false
})

const { formRules, submitLoading } = toRefs(data)

const isGroup = computed(() => {
  return formData.level == 3
})
//默认值
const MENU_DEFAULT = {
  level: '1',
  status: 1,
  isCache: 0,
  isColumnCache: 0,
  selfFlag: 0,
  openType: 1,
}
const formData = reactive<any>({
  ...cloneDeep(MENU_DEFAULT),
  id: '',
  name: '',
  parentId: 0,
  url: '/backend-v2/',
  sort: 0,
  icon: '',
  perms: '',
  selfFlag: 0,
  status: 1
})

function handleOpen() {
  const current = props.current as any
  if (!props.isAdd) {
    Object.keys(formData).forEach(key => {
      //@ts-ignore
      if (Object.hasOwn(current, key)) formData[key] = current[key]
    })
  } else {
    Object.keys(formData).forEach(key => {
      if (Object.hasOwn(MENU_DEFAULT, key)) {
        //@ts-ignore
        formData[key] = MENU_DEFAULT[key]
      } else {
        //@ts-ignore
        formData[key] = ''
      }
    })
    formData.parentId = <number>props.current?.id
    formData.level = props.current ? formData.level : 3
    formData.selfFlag = props.menuType == 4 ? 1 : 0
    if (props?.current?.selfFlag == 1) {
      formData.selfFlag = 1
    }
    nextTick(() => {
      handleReset()
    })
  }
}

const parentName = computed(() => {
  const { current, isAdd } = props
  return isAdd ? current?.name : current?.parentName
})

function handleReset() {
  if (form.value) {
    form.value.resetFields()
  }
}
function handleSubmit() {

  //@ts-ignore
  form.value
    .validate()
    .then(() => {
      const subForm = markRaw(formData) as any
      submitLoading.value = true
      menu_api.A_menuSave({
        ...subForm,
        url: subForm.level === 2 ? '' : subForm.url,
        menuType: props.menuType
      }).then(() => {
        ElMessage({
          message: `${props.isAdd ? '新增' : '编辑'}成功`,
          type: 'success'
        })
        handleClose()
        emits('update')
      })
    })
    .finally(() => {
      submitLoading.value = false
    })
}
function handleClose() {
  handleReset()
  emits('update:modelValue', false)
}
</script>

<template>
  <el-dialog v-bind="$attrs" :title="`${isAdd ? '新增' : '编辑'}${isGroup ? '分组' : '菜单'}`" destroy-on-close
    :close-on-click-modal="false" @open="handleOpen" @closed="handleClose" draggable>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="120px">
      <!-- 分组 -->
      <template v-if="isGroup">
        <el-form-item prop="name" label="分组名称">
          <el-input v-model.trim="formData.name" placeholder="分组名称" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标">
          <el-input v-model="formData.icon" placeholder="菜单图标" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="url" label="路由">
          <el-input v-model="formData.url" placeholder="路由" maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="isCache" label="是否缓存">
          <el-radio-group v-model="formData.isCache">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="selfFlag" label="是否自营菜单">
          <el-radio-group v-model="formData.selfFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input-number v-model="formData.sort" controls-position="right" :min="0" label="排序"></el-input-number>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item v-if="!isGroup" prop="type" label="类型">
          <el-radio-group v-model="formData.level">
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model.trim="formData.name" placeholder="名称" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" class="popover-list">
          <el-input v-model="parentName" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="formData.level == 1" prop="url" label="路由">
          <el-input v-model="formData.url" placeholder="路由"></el-input>
        </el-form-item>
        <el-form-item prop="perms" label="授权标识">
          <el-input v-model.trim="formData.perms" placeholder="多个用逗号分隔，如：sys:menu:save,sys:menu:update"></el-input>
        </el-form-item>
        <el-form-item v-if="formData.level == 1" label="隐藏菜单">
          <el-radio-group v-model="formData.status">
            <el-radio-button :label="1">否</el-radio-button>
            <el-radio-button :label="2">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="selfFlag" label="是否自营菜单">
          <el-radio-group v-model="formData.selfFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.level == 1" prop="isCache" label="是否缓存">
          <el-radio-group v-model="formData.isCache">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.level == 1" prop="isColumnCache" label="是否开启列缓存">
          <el-radio-group v-model="formData.isColumnCache">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item v-if="formData.level == 1" prop="openType" label="页签打开模式">
          <el-radio-group v-model="formData.openType">
            <el-radio :label="1">正常跳转</el-radio>
            <el-radio :label="2">保存并打开新页签</el-radio>
            <el-radio :label="3">打开新窗口</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item prop="sort" label="排序">
          <el-input-number v-model="formData.sort" controls-position="right" :min="0" label="排序"></el-input-number>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <div class="footer-wrap">
        <el-button @click="handleClose">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmit()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-input) {
  width: 248px;
}
</style>
