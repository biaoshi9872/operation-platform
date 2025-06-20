<script setup lang="ts">
import { validatePhone } from '@/utils/validator'
import { FormInstance } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import GoodItem from './GoodItem.vue'
import { skuInfoDefault } from './config'

interface IProp {
  detail: any,
  deliveryType: any,
  chooseDetail: any
  index: number,
}
const props = withDefaults(defineProps<IProp>(), {
  detail: {
    goodsInfoList: []
  },
  chooseDetail: [],
  deliveryType: '1',
  index: -1
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'addHandler'): void
  (e: 'deleteHandler', index: number): void
  (e: 'refresh'): void
}>()

//物流
const formDeliveryList: any = inject('formDeliveryList', () => { })

const formRef = ref<FormInstance>() as any

interface IData {
  formRules: any
}

const data = reactive<IData>({
  formRules: {
    expressCompanyCode: [{ required: true, message: '请选择物流公司', trigger: ['change', 'blur'] }],
    expressCode: [{ required: true, message: '请输入快递单号', trigger: ['change', 'blur'] }],
    mobile: [{ required: true, message: '请填写联系方式', trigger: 'blur' }, { validator: validatePhone }],
    goodsInfoList: [{
      required: true, message: '请选择发货商品', trigger: 'none'
    }]
  }
})

const { formRules } = toRefs(data)

const addHandler = () => {
  emits('addHandler')
}

const deleteHandler = () => {
  emits('deleteHandler', props.index)
}

//添加
const addItemHandler = () => {
  let obj = cloneDeep(skuInfoDefault)
  props.detail.goodsInfoList.push(obj)
}

//删除
const deleteItemHandler = (index: number) => {
  props.detail.goodsInfoList.splice(index, 1)
}

const validate = async () => {
  const res = await formRef.value.validate()
  const result = await validateDetail()
  if (res && result) {
    return true
  }
}

const clearValidate = () => {
  formRef.value.resetFields()
}

let goodItemRef: any = ref(null)
const validateDetail = async () => {
  let arr: any = []
  goodItemRef.value.forEach((el: any) => {
    arr.push(el.validate())
  })
  let res = await Promise.allSettled(arr)
  if (res.every((item: any) => item.value == true)) {
    return Promise.resolve(true)
  }
  return Promise.reject(false)
}

//
const handleChange = (value: any) => {
  props.detail.expressCompanyName = formDeliveryList.value?.find((el: any) => { return el.expressCompanyCode == value })?.expressCompanyName
}

defineExpose({
  validate,
  clearValidate
})


</script>
<template>
  <div class="choose-container">
    <div class="choose-content">
      <el-form ref="formRef" :model="detail" class="formPanel" :inline="true" :rules="formRules">
        <div>
          <template v-if="deliveryType == '1'">
            <el-form-item label="物流公司:" class="formItem" prop="expressCompanyCode" label-width="110px">
              <el-select clearable v-model="detail.expressCompanyCode" class="w-150" filterable placeholder="全部"
                @change="handleChange">
                <el-option v-for="(item, index) in formDeliveryList" :key="index" :label="item.expressCompanyName"
                  :value="item.expressCompanyCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="快递单号:" v-if="detail.expressCompanyCode !== 'zps'" prop="expressCode"
              label-width="110px">
              <div class="tip">
                <el-input clearable v-model="detail.expressCode" maxlength="20" show-word-limit class="w-150"
                  placeholder="请填写快递单号" />
              </div>
            </el-form-item>
          </template>
          <template v-else="deliveryType == '1'">
            <el-form-item label="配送电话:" prop="mobile" label-width="110px">
              <div class="tip">
                <el-input clearable v-model="detail.mobile" maxlength="11" show-word-limit class="w-150"
                  placeholder="请填配送电话" />
              </div>
            </el-form-item>
          </template>
        </div>
        <div>
          <el-form-item label="发货商品明细:" label-width="110px">
            <div class="tip">
              <GoodItem ref="goodItemRef" v-for="(item, index) in detail.goodsInfoList"
                @delete-handler="deleteItemHandler" @addHandler="addItemHandler" :index="index" :topIndex="props.index"
                :allGoodsInfoList="detail.goodsInfoList" :detail="item" :key="index"></GoodItem>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div>

    </div>
    <div class="option_container ml-8">
      <svg-icon class="icon" name="addItem" @click="addHandler"></svg-icon>
      <svg-icon class="icon" v-if="chooseDetail.length > 1" @click="deleteHandler" name="delete"></svg-icon>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.choose-container {
  margin: 16px 0;
  display: flex;

  .choose-content {
    padding: 8px;
    border: 1px solid var(--theme-border-color-light);
    flex: 1;
  }

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

  .option_container {
    width: 80px;
    flex-shrink: 0;
  }
}
</style>
