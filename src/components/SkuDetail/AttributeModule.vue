<script setup lang="ts">
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import { split } from 'lodash-es'
const { isCombinationGoods } = isStateCheckHooks()

interface IProp {
  row: any
  parentRow?: any
  comboNumName: string
  attributeValue1: string
  attributeValue2: string
}
const props = withDefaults(defineProps<IProp>(), {
  row: {},
  parentRow: {},
  comboNumName: 'comboNum',
  attributeValue1: '',
  attributeValue2: ''
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const attributeRef1 = ref(null)
const attributeRef2 = ref(null)
const attribute1TooltipShow = ref(false)
const attribute2TooltipShow = ref(false)

onMounted(() => {
  setTimeout(() => {
    attribute1TooltipShow.value = checkEllipsis(attributeRef1.value)
    attribute2TooltipShow.value = checkEllipsis(attributeRef2.value)
  }, 500)
})

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
      let value = el.title || el.skuName
      let comboNum = el[props.comboNumName] > 1 ? ` * ${el[props.comboNumName]}` : ''
      return `${value}${comboNum} `
    })
  } else {
    return props.row.skuList?.map((el: any) => {
      let value = el.title || el.skuName
      let comboNum = el[props.comboNumName] > 1 ? ` * ${el[props.comboNumName]}` : ''
      return `${value}${comboNum} `
    })
  }
})
</script>

<template>
  <div v-if="isShowAttr" class="combination-goods-attr">
    <template class v-for="(item,index) in arrList" :key="index">
      <div class="attr_box">
        <el-tooltip
          class="item"
          effect="dark"
          :content="item"
          :disabled="!editCellUpdateRefResult['editCellUpdateRefResult-' + index + '_attribute']"
          placement="top"
        >
          <span :ref="(el)=>{ refAdd(el,index,'attribute') }">{{ item }}</span>
        </el-tooltip>
      </div>
    </template>
  </div>
  <div v-else class="attr_box">
    <el-tooltip class="item" effect="dark" :content="attributeValue1 || row.spec" :disabled="!attribute1TooltipShow" placement="top">
      <span ref="attributeRef1">{{ attributeValue1 || row.spec || '/'}}</span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="attributeValue2" :disabled="!attribute2TooltipShow" placement="top">
      <span ref="attributeRef2" v-if="attributeValue2">,{{ attributeValue2 }}</span>
    </el-tooltip>
  </div>
</template>
<style lang="scss" scoped>
.attr_box {
  display: flex;
  flex-wrap: wrap;
  span {
    max-height: 40px;
    @include overflow(1);
  }
}
</style>