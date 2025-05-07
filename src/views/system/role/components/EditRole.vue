<!--
 * @Author: ncc 472253853@qq.com
 * @Date: 2022-06-16 11:18:47
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-04-28 09:38:12
-->

<script setup lang="ts" name="EditRole">
import role_api from '@/api/system/role'
import { reactive, ref, onMounted } from 'vue'
import system_num from '@/utils/constant/system'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps({
  isAdd: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object,
    default: () => {}
  },
  curyCheckRow: {
    type: Object,
    default: () => {}
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update'): void
}>()

const form:any = ref<FormInstance>()
const data = reactive({
  formData: {
    id: '',
    parentId: '',
    roleName: '',
    orgType:'',
  },
  roleTagList: [],
  formRules: {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    orgType: [{ required: true, message: '请选择机构类型', trigger: 'blur' }]
  },
  roleTreeList: [],
  submitLoading: false
})

const handleOpen = () => {
  if (!props.isAdd) {
    const { id, parentId, roleName, orgType } = props.current
    data.formData = { id, parentId, roleName, orgType }
  }
}

// 初始化 dialog 数据，恢复表单数据，清除表单校验等
const handleReset = () => {
  // 重置表单数
  if (form.value) {
    form.value.resetFields()
    data.formData = {
      id: '',
      parentId: '',
      roleName: '',
      orgType: ''
    }
  }
  emits('update:modelValue', false)
}
const handleSubmit = () => {
  form.value
    .validate()
    .then(() => {
      data.submitLoading = true
       role_api.A_roleSave({
        ...data.formData
      }).then((res: any) => {
        ElMessage({
        message: `${props.isAdd ? '新增' : '编辑'}角色成功`,
        type: 'success'
      })
      handleClose()
      emits('update')
      })
    })
    .then(() => {
    
    })
    .finally(() => {
      data.submitLoading = false
    })
}
const handleClose = () => {
  emits('update:modelValue', false)
}

</script>

<template>
  <el-dialog
    v-bind="$attrs"
    :title="`${isAdd ? '新增' : '编辑'}角色`"
    destroy-on-close
    width="500px"
    :close-on-click-modal="false"
    @open="handleOpen"
    @closed="handleReset"
  >
    <el-form ref="form" :model="data.formData" :rules="data.formRules" label-width="120px" label-suffix="：">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model.trim="data.formData.roleName" placeholder="请输入角色名称" maxlength="20" show-word-limit clearable class="w-248" />
      </el-form-item>
      <el-form-item label="机构类型" prop="orgType">
        <el-select v-model="data.formData.orgType" class="w-248" placeholder="请选择机构类型">
          <el-option v-for=" (item, index) in system_num.orgType " :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer-wrap">
        <el-button @click="handleClose">取消</el-button>
        <el-button :loading="data.submitLoading" type="primary" @click="handleSubmit()" v-preventReClick="1500">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-input) {
  width: 248px;
}
</style>
