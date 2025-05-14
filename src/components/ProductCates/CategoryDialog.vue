<script setup lang="ts">
import { ElMessage, FormInstance, ElMessageBox, FormRules } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { A_getTreeCateInfo } from '@/api/proudectManger'

interface IProp {
  categoryCode: any
  editIconClose: any
  checkStrictly: any
  title?: string
  comboType?: string
  categoryCodeName: string
}

const props = withDefaults(defineProps<IProp>(), {
  categoryCode: '',
  categoryCodeName: '',
  editIconClose: true,
  title: '选择类目',
  comboType: '',
  checkStrictly: false
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'update:categoryCode', value: any): void
  (e: 'update:categoryCodeName', value: any): void
  (e: 'submit', value: any): void
}>()

const formRef = ref<FormInstance>() as any

interface IData {
  categoryCodeName: any
  category: any
  options: any[]
  fromData: any
  submitLoading: boolean
  title: String
}

const getTreeCateInfo = () => {
  const { categoryName = null } = data.fromData
  const comboType = props.comboType
  A_getTreeCateInfo({ categoryName, comboType }).then((res: any) => {
    data.options = res || []
    bindClick()
  })
}

const expandChange = () => {
  bindClick()
}

const bindClick = () => {
  nextTick(() => {
    props.checkStrictly &&
      document.querySelectorAll('.content .el-cascader-node__label').forEach((el: any) => {
        el.onclick = function() {
          el.parentNode?.childNodes[1].click()
        }
      })
  })
}

const data = reactive<IData>({
  fromData: {
    categoryName: ''
  },
  categoryCodeName: '',
  category: [],
  options: [],
  submitLoading: false,
  title: '选择类目'
})

const optionProps = computed(() => {
  return {
    label: 'categoryName',
    value: 'categoryCode',
    children: 'childrenInfo',
    checkStrictly: props.checkStrictly
  }
})

//重置
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  emits('update:modelValue', false)
}

//提交
const handleSubmit = () => {
  const { categoryCodeName, category } = data
  const categoryCode = category.join('|')
  const oldCategoryCode = props.categoryCode
  if (oldCategoryCode && oldCategoryCode !== categoryCode && props.editIconClose) {
    ElMessageBox.confirm('商品分类变更将导致原商品失效，请谨慎操作。是否确定修改分类?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      emits('submit', {
        oldCategoryCode,
        categoryCode
      })
      emits('update:categoryCode', categoryCode)
      emits('update:categoryCodeName', categoryCodeName)
      handleClose()
    })
  } else {
    emits('submit', {
      oldCategoryCode,
      categoryCode
    })
    emits('update:categoryCode', categoryCode)
    emits('update:categoryCodeName', categoryCodeName)
    handleClose()
  }
}

//打开
const openHandler = () => {
  data.categoryCodeName = props.categoryCodeName
  data.category = props?.categoryCode?.split('|') || []
  data.fromData.categoryName = ''
  nextTick(() => {
    getTreeCateInfo()
  })
}

//关闭
const handleClose = () => {
  emits('update:modelValue', false)
}

const cascaderRef = ref(null)

const categoryValue = computed({
  get() {
    return props?.categoryCode?.split('|') || []
  },
  set(value) {
    data.category = value
  }
})

const changeHandler = (e: any) => {
  nextTick(() => {
    data.categoryCodeName = cascaderRef.value?.getCheckedNodes()?.[0]?.pathLabels?.join('>')
  })
}

const blurHandler = () => {
  getTreeCateInfo()
}
</script>
<template>
  <el-dialog
    v-bind="$attrs"
    :title="title"
    custom-class="dialog-l"
    @open="openHandler"
    destroy-on-close
    :close-on-click-modal="false"
    @closed="handleReset"
  >
    <div class="content">
      <div class="mb-16">
        <el-input
          v-model="data.fromData.categoryName"
          placeholder="请输入至少1个字"
          maxlength="100"
          @blur="blurHandler"
          class="w-200"
          @keydown.enter="blurHandler"
        >
          <template #suffix>
            <div @click="blurHandler">
              <el-icon>
                <Search />
              </el-icon>
            </div>
          </template>
        </el-input>
      </div>
      <el-cascader-panel
        ref="cascaderRef"
        @expand-change="expandChange"
        v-model="categoryValue"
        :props="optionProps"
        :options="data.options"
        @change="changeHandler"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div>
          <span>正在选择：</span>
          <span v-if="data.categoryCodeName" class="check-node-title">{{ data.categoryCodeName }}</span>
          <span v-else>没有选择任何类别</span>
        </div>
        <div>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" :loading="data.submitLoading" :disabled="!data.categoryCodeName" @click="handleSubmit">确认</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.content {
  background-color: #f6f6f6;
  padding: 16px;

  > .el-cascader-panel {
    background-color: var(--el-searchForm-bg-color);
  }

  ::v-deep(.el-input__wrapper) {
    box-shadow: none !important;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .check-node-title {
    color: #333;
    font-weight: bold;
  }
}
</style>
