<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { merge, omit } from 'lodash-es'

interface IProp {
  detail: any
  allGoodsInfoList: any
  index: number
  topIndex: number
}
const props = withDefaults(defineProps<IProp>(), {
  detail: {},
  allGoodsInfoList: [],
  index: -1,
  topIndex: -1
})
//
const goodsInfoList: any = inject('goodsInfoList', () => [])
const chooseDetail: any = inject('chooseDetail', () => [])
const tableFromData: any = inject('tableFromData', () => [])

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'addHandler'): void
  (e: 'deleteHandler', index: number): void
}>()

const addHandler = () => {
  emits('addHandler')
}

const deleteHandler = () => {
  emits('deleteHandler', props.index)
}

const validatorSkuCode = (rule: any, value: any, callback: any) => {
  const result = chooseDetail.value[props.topIndex]?.goodsInfoList.filter((el: any) => el.skuCode == value).length
  if (result > 1) {
    callback(new Error('请勿将同一商品拆开！'))
  } else {
    callback()
  }
}

const validatorNum = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('发货数量不可为0'))
  } else {
    callback()
  }
}

const dataPage = reactive({
  formRules: {
    skuCode: [
      { required: true, message: '请选择商品名称', trigger: ['change', 'blur'] },
      {
        validator: validatorSkuCode,
        trigger: ['blur', 'change']
      }
    ],
    deliverNum: [
      { required: true, message: '请填写发货数量', trigger: ['change', 'blur'] },
      {
        validator: validatorNum,
        trigger: ['blur', 'change']
      }
    ]
  }
})

const formRef = ref<FormInstance>() as any

const validate = async () => {
  const res = await formRef.value.validate()
  if (res) {
    return true
  }
}

defineExpose({
  validate
})

const changeHandler = (value: any) => {
  // if (value > maxSum.value) {
  //   props.detail.deliverNum = maxSum.value
  //   ElMessage.error('数量超过最大限制！')
  // }
}

const skuChangeHandler = (value: any) => {
  let item = goodsInfoList?.value.find((el: any) => el.skuCode == value)
  item.skuImage = item.images
  merge(props.detail, omit(item, ['deliverNum']))
}

//最大数量
const maxSum = computed(() => {
  // TODO:
  //剔除当前明细
  const obj = chooseDetail.value.filter((item: any, index: any) => {
    return index != props.topIndex
  })
  let sum =
    obj.reduce((prev: any, cur: any) => {
      const arr = cur?.goodsInfoList?.filter((item: any) => item.skuCode == props.detail.skuCode)
      const curryTotalSum = arr.reduce((total: any, cur: any) => {
        return (total += cur.deliverNum)
      }, 0)
      return (prev += curryTotalSum)
    }, 0) || 0
  let maxSumStr = (tableFromData.value.filter((item: any) => item.skuCode == props.detail.skuCode)?.[0]?.deliverNum || 0) - sum
  return maxSumStr
})
</script>
<template>
  <div class="good-item-container mt-20">
    <el-form ref="formRef" :inline="true" :model="detail" :rules="dataPage.formRules">
      <div class="flex">
        <div class="flex">
          <el-form-item label="商品名称:" prop="skuCode">
            <el-select v-model="detail.skuCode" class="w-150" @change="skuChangeHandler">
              <el-option v-for="item in goodsInfoList" :key="item.skuCode" :label="item.skuName + (item.spec || '')"
                :title="item.skuName + (item.spec || '')" :value="item.skuCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货数量:" prop="deliverNum">
            <div class="tip">
              <el-input-number v-model="detail.deliverNum" :controls="false" :precision="0" :min="0"
                @change="changeHandler" />
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <svg-icon class="icon" @click="addHandler" name="addItem"></svg-icon>
          <svg-icon class="icon" v-if="allGoodsInfoList.length > 1" @click="deleteHandler" name="delete"></svg-icon>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.good-item-container {
  width: 100%;

  .icon {
    font-size: 20px;
    margin-right: 4px;
    color: var(--el-color-primary);
    cursor: pointer;
  }

  .icon:hover {
    color: var(--el-color-primary);
    opacity: 0.6;
  }
}
</style>
