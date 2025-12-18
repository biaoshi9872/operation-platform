<script setup lang="ts">
import announcement_api from '@/api/announcement'
import { ElMessage } from 'element-plus'
import MyTinymce from '@/components/MyTinymce/index.vue'

interface IProp {
  type: 'add' | 'edit' | 'detail'
  id?: number,
  source?: string,
  linkId?: number
}
const props = withDefaults(defineProps<IProp>(), {
  type: 'add',
  source: '1'
})
const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits(['success'])

const dataInfo = reactive({
  form: {
    id: null as null | number,
    title: '',
    content: ''
  },
  loading: false
})
const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}
const formRef = ref()

// Watch visible to reset/init
watch(visible, (val) => {
  if (val) {
    init()
  } else {
    // clear form
    dataInfo.form = { id: null, title: '', content: '' }
    // reset validation
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }
})

const init = () => {
  if (props.type !== 'add' && props.id) {
    getDetail(props.id)
  }
}
const getDetail = (id: number) => {
  dataInfo.loading = true
  announcement_api.A_detail({ id, linkId: props.linkId, type: props.source }).then((res: any) => {
    dataInfo.form = {
      id: res?.id ?? id,
      title: res?.title ?? '',
      content: res?.content ?? ''
    }
  }).finally(() => {
    dataInfo.loading = false
  })
}

const handleSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    dataInfo.loading = true
    try {
      if (props.type === 'add') {
        await announcement_api.A_add({
          title: dataInfo.form.title, content: dataInfo.form.content, linkId:
            props.linkId,
          type: props.source
        })
        ElMessage.success('新增成功')
      } else {
        await announcement_api.A_update({
          id: Number(dataInfo.form.id), title: dataInfo.form.title, content:
            dataInfo.form.content, linkId: props.linkId, type: props.source
        })
        ElMessage.success('编辑成功')
      }
      visible.value = false
      emit('success')
    } finally {
      dataInfo.loading = false
    }
  })
}

const handleClose = () => {
  visible.value = false
}

const titleMap = {
  '1': {
    add: '新增公告',
    edit: '编辑公告',
    detail: '公告详情'
  },
  '2': {
    add: '新增版本迭代通知',
    edit: '编辑版本迭代通知',
    detail: '版本迭代通知详情'
  }
}
</script>

<template>
  <el-dialog v-model="visible" :title="titleMap[props.source][props.type]" width="800px" :close-on-click-modal="false"
    destroy-on-close>
    <el-form ref="formRef" :model="dataInfo.form" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="dataInfo.form.title" maxlength="100" show-word-limit :disabled="props.type === 'detail'"
          placeholder="请输入公告标题"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <MyTinymce v-model="dataInfo.form.content" :disabled="props.type === 'detail'"
          :readonly="props.type === 'detail'" placeholder="请输入公告内容" :height="400" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="props.type !== 'detail'" type="primary" :loading="dataInfo.loading" @click="handleSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
::v-deep .table_model_box {
  min-height: 0px !important;
}
</style>
