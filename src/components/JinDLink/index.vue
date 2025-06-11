<script setup lang="ts">
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import { validURL } from '@/utils/validator'
import { ElMessage } from 'element-plus'
const { isCombinationGoods } = isStateCheckHooks()
defineOptions({ name: 'JinDLink' })

interface IProp {
  modelValue: string
  type: 'edit' | 'view'
  row: any
  parentRow: any
}
const props = withDefaults(defineProps<IProp>(), {
  modelValue: '',
  type: 'edit',
  row: {},
  parentRow: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change'): void
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})

const select = ref('1')
const changeHandler = (value: string) => {
  if (value == '商品为非电商款，无电商链接') emits('update:modelValue', value)
  emits('change')
}
const jBlurHandler = () => {
  const url = value.value
  if (!validURL(url) && url !== '商品为非电商款，无电商链接') {
    ElMessage.error('请输入正确的网址！')
    emits('update:modelValue', '')
  } else {
    nextTick(() => {
      emits('change')
    })
  }
}
const checkEllipsis = (el: any, lineNum: number = 1) => {
  let lineHeight = getComputedStyle(el)?.lineHeight?.replaceAll('px', '') || (0 as any)
  let scrollHeight = el.scrollHeight
  return scrollHeight > lineHeight * lineNum
}
const editCellUpdateRef = ref({}) as any
const editCellUpdateRefResult = ref({}) as any

const isShowAttr = computed(() => {
  let row = props.row
  if (props?.parentRow?.hasOwnProperty('comboType')) {
    row = props?.parentRow
  }
  return isCombinationGoods(row)
})
const refAdd = (el: any, index: any, filedName: string) => {
  nextTick(() => {
    console.log(el, index, filedName)
    if (el) {
      editCellUpdateRef.value['editCellUpdateRef' + '-' + index + '_' + filedName] = el
      editCellUpdateRefResult.value['editCellUpdateRefResult' + '-' + index + '_' + filedName] = checkEllipsis(
        editCellUpdateRef.value['editCellUpdateRef' + '-' + index + '_' + filedName]
      )
    }
  })
}

const arrList = computed(() => {
  if (props.row.hasOwnProperty('comboSkuList')) {
    return props.row.comboSkuList?.map((el: any) => {
      return el.jdLink
    })
  } else {
    return props.row.skuList?.map((el: any) => {
      return el.jdLink
    })
  }
})
</script>
<template>
  <div v-if="type == 'edit'" class="jin-edit-container">
    <el-input v-model="value" class="el-input-container" @blur="jBlurHandler" :disabled="select === '商品为非电商款，无电商链接'"
      placeholder="请输入">
      <template #append>
        <el-select v-model="select" style="width:80px" @change="changeHandler">
          <el-option label="文本输入" value="1" />
          <el-option label="商品为非电商款，无电商链接" value="商品为非电商款，无电商链接" />
        </el-select>
      </template>
    </el-input>
  </div>
  <div v-else>
    <div v-if="isShowAttr">
      <template class v-for="(item, index) in arrList" :key="index">
        <div class="attr_box">
          <el-tooltip class="item" effect="dark" :content="item" placement="top">
            <a class="link" :href="item" target="_blank" :ref="(el) => { refAdd(el, index, 'attribute') }"
              v-if="item !== '商品为非电商款，无电商链接'">{{ item ? item : '-' }}</a>
            <span class="link" :ref="(el) => { refAdd(el, index, 'attribute') }" v-else>商品为非电商款，无电商链接</span>
          </el-tooltip>
        </div>
      </template>
    </div>
    <div v-else class="jd_box">
      <el-tooltip class="box-item" effect="dark" :content="row.jdLink" placement="top">
        <span v-if="row.jdLink !== '商品为非电商款，无电商链接'">
          <a class="link" :href="row.jdLink" target="_blank">{{ row.jdLink }}</a>
          {{ row.jdLink ? '' : '-' }}
        </span>
        <span class="link" v-else>商品为非电商款，无电商链接</span>
      </el-tooltip>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.jin-edit-container {
  ::v-deep(.el-input__validateIcon) {
    display: none !important;
    color: red;
  }
}

.attr_box {
  text-align: left;

  span {
    max-height: 40px;

    @include overflow(1);
  }

  a {
    text-decoration: underline;
    color: var(--el-color-primary);
    @include overflow(1);
  }
}

.jd_box {
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  text-align: left;

  span {
    max-height: 40px;
    @include overflow(1);
  }

  a {
    text-decoration: underline;
    color: var(--el-color-primary);
    @include overflow(1);
  }
}

.link {
  word-break: break-all;
}
</style>