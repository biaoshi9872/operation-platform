<script setup lang="ts" name="ProductCates">
defineOptions({
  name: 'ProductCates'
})

import CategoryDialog from './CategoryDialog.vue'

const props = defineProps({
  category: {
    type: String,
    default: ''
  },
  comboType: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  categoryName: {
    type: String,
    default: ''
  },
  editIconClose: {
    type: Boolean,
    default: true
  },
  checkStrictly: {
    type: Boolean,
    default: false
  },
  firstCateId: {
    type: String,
    default: ''
  },
  secondCateId: {
    type: String,
    default: ''
  },
  thirdCateId: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:category', 'update:categoryName', 'submit', 'update:firstCateId', 'update:secondCateId', 'update:thirdCateId'])

const data = reactive({
  categoryDialogShow: false,
  categoryCodeName: ''
})

const categoryCode = computed({
  get() {
    return props.category
  },
  set(value) {
    emits('update:category', value)
    let arr = value?.split('|') || []
    emits('update:firstCateId', arr[0] || '')
    emits('update:secondCateId', arr[1] || '')
    emits('update:thirdCateId', arr[2] || '')
  }
})

const categoryCodeName = computed({
  get() {
    return props.categoryName
  },
  set(value) {
    emits('update:categoryName', value)
  }
})

const submitHandler = (value: any) => {
  emits('submit', value)
}

const changeHandler = (value: any) => { }

//打开分类
const openCategoryDialogHandler = () => {
  data.categoryDialogShow = true
}

const clearCategoryDialogHandler = () => {
  emits('update:categoryName', '')
  emits('update:category', '')
  categoryCode.value = ''
}
</script>
<template>
  <el-input readonly v-model="categoryCodeName" placeholder="请选择商品分类" maxlength="180" show-word-limit
    @click="openCategoryDialogHandler">
    <template #append>
      <el-icon v-if="categoryCode && !editIconClose" @click.stop="clearCategoryDialogHandler">
        <CloseBold />
      </el-icon>
      <el-icon v-else @click="openCategoryDialogHandler">
        <MoreFilled />
      </el-icon>
    </template>
  </el-input>
  <CategoryDialog :comboType="comboType" :type="type" v-model="data.categoryDialogShow" @change="changeHandler"
    v-model:category-code="categoryCode" v-model:categoryCodeName="categoryCodeName" :editIconClose="editIconClose"
    :checkStrictly="checkStrictly" @submit="submitHandler"></CategoryDialog>
</template>

<style lang="scss" scoped>
::v-deep(.el-input-group__append) {
  box-shadow: none !important;
  border: 1px solid var(--el-border-color);
}
</style>
