<script setup lang="ts">
import order_api from '@/api/order'
import systemUtils_api from '@/api/system/systemUtils'
import { ElMessage, FormInstance } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { computed, inject, nextTick, onMounted, provide, reactive, ref, watch } from 'vue'
import ChooseItem from './ChooseItem.vue'
import { skuInfoDefault } from './config'

interface IProp {
  curryInfo: any
  outgoingType: 1 | 2 //1 订单 2售后单
}
const props = withDefaults(defineProps<IProp>(), {
  curryInfo: {},
  outgoingType: 1
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'refresh'): void
}>()

const formRef = ref<FormInstance>() as any
interface IData {
  formData: any
  formDataBK: any
  formRules: any
  tableFromData: any
  submitLoading: boolean
  chooseDetail: any //发货明细
  formDeliveryList: any //物流公司
  deliveryType: any //发货类型
  userInfo: any
}
const data = reactive<IData>({
  formData: {
    deliverNum: ''
  },
  formDataBK: {},
  formRules: {
    deliverNum: [{ required: true, message: '请输入商品数量', trigger: ['change', 'blur'] }]
  },
  tableFromData: [],
  userInfo: {
    name: '',
    mobile: '',
    provinceId: '',
    cityId: '',
    countyId: '',
    townId: '',
    address: ''
  },
  deliveryType: '1',
  submitLoading: false,
  chooseDetail: [], //发货明细
  //
  formDeliveryList: []
})
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  emits('update:modelValue', false)
}
const handleClose = () => {
  handleReset()
  emits('refresh')
  searchQueryHandler()
  emits('update:modelValue', false)
}

const searchQueryHandler = inject('searchQueryHandler', () => { })

//快递公司
provide(
  'formDeliveryList',
  computed(() => {
    return data.formDeliveryList?.map((item: any) => {
      return {
        expressCompanyCode: item.companyCode,
        expressCompanyName: item.companyName
      }
    })
  })
)

const waitDeliveryList = computed(() => {
  return data.tableFromData.filter((el: any) => {
    return el.outgoingStatus == 0
  })
})

//商品明细
provide(
  'goodsInfoList',
  computed(() => {
    return waitDeliveryList.value
  })
)
//已选发货明细
provide(
  'chooseDetail',
  computed(() => {
    return data.chooseDetail
  })
)
//总待发货明细
provide(
  'tableFromData',
  computed(() => {
    return waitDeliveryList.value
  })
)

onMounted(() => {
  data.formDataBK = cloneDeep(data.formData)
  queryComList()
})
const openHandler = () => {
  data.formData = {
    ...data.formDataBK
  }
  data.deliveryType = '1'
  if (props.outgoingType == 1) {
    orderDeliverOrder()
  }
  nextTick(() => {
    clearValidate()
  })
}
const handleSubmit = () => {
  //1.校验同一个商品需要一次性填写完发货信息
  const checkList = validateDetailNum()
  if (checkList.length) {
    let titles = checkList.map(item => item.skuName).join(',')
    return ElMessage.warning(`(${titles})发货数量不等于实际待发货数量，请检查后重新操作；`)
  }
  //2.校验必填项
  validate().then((res: any) => {
    console.log(res)
    if (res) {
      if (props.outgoingType == 1) {
        orderSave()
      }
    }
  })
}

//默认展示第一个
const showDefaultDetail = () => {
  data.chooseDetail = []
  //物流
  let obj = {
    deliverInfo: {
      expressCompanyCode: '', //快递公司
      expressCode: '' //快递单号
    },
    goodsInfoList: []
  }
  //商品明细
  let arr: any = []
  waitDeliveryList.value.forEach((item: any, index: number) => {
    let children = cloneDeep(skuInfoDefault)
    children.skuCode = item.skuCode
    children.skuName = item.skuName
    children.deliverNum = item.deliverNum
    children.skuImage = item.images

    arr.push(children)
  })
  obj.goodsInfoList = arr
  data.chooseDetail.push(obj)
}

const addHandler = () => {
  //物流
  let obj = {
    deliverInfo: {
      expressCompanyCode: '', //快递公司
      expressCode: '' //快递单号
    },
    goodsInfoList: []
  }
  //1.检查是否又待分配商品
  let checkWaitGoods = waitDeliveryList.value.filter((item: any) => item.deliverNum !== item.numChoose).length
  if (checkWaitGoods) {
    //平铺
    let arr: any = []
    waitDeliveryList.value
      .filter((item: any) => item.deliverNum !== item.numChoose)
      .forEach((item: any, index: number) => {
        let children = cloneDeep(skuInfoDefault)
        children.skuCode = item.skuCode
        children.skuName = item.skuName
        children.deliverNum = item.deliverNum - item.numChoose
        children.skuImage = item.images
        arr.push(children)
        obj.goodsInfoList = arr
      })
  } else {
    //商品明细
    let arr: any = []
    let children = cloneDeep(skuInfoDefault)
    arr.push(children)
    obj.goodsInfoList = arr
  }
  data.chooseDetail.push(obj)
}

//删除
const deleteHandler = (index: number) => {
  data.chooseDetail.splice(index, 1)
}

const queryComList = () => {
  systemUtils_api.A_getLogisticList().then((res: any) => {
    data.formDeliveryList = res
  })
}

watch(
  () => data.chooseDetail,
  (newValue, oldValue) => {
    //虚拟发货字段重新计算
    data.tableFromData.forEach((el: any) => {
      let sum = el.deliverNum
      let objArr = data.chooseDetail
        .map((item: any) => {
          return item.goodsInfoList
        })
        .flat(2)
      sum = objArr
        .filter((children: any) => {
          return children.skuCode == el.skuCode
        })
        .reduce((total: any, curry: any) => {
          return total + curry.deliverNum
        }, 0)
      el.numChoose = el.outgoingStatus == '1' ? el.deliverNum : sum
    })
  },
  {
    deep: true,
    immediate: true
  }
)

//订单
const orderDeliverOrder = () => {
  const channelOrderNo = props?.curryInfo?.channelOrderNo
  channelOrderNo &&
    order_api.A_deliverOrder({ channelOrderNo }).then((res: any) => {
      console.log(res, 'A_deliverOrder')
      data.tableFromData = res.goodsVOList
      data.userInfo = {
        ...data.userInfo,
        ...res
      }
      showDefaultDetail()
    })
}

//订单保存
const orderSave = () => {
  const { channelOrderNo } = props.curryInfo
  const { outgoingType } = props
  const deliveryType = data.deliveryType
  const expressInfoList = data.chooseDetail
  order_api.A_deliverOrderSave({ channelOrderNo, outgoingType, deliveryType, expressInfoList }).then((res: any) => {
    ElMessage.success('发货成功')
    handleClose()
  })
}
const chooseItemRef: any = ref(null)

const validate = async () => {
  let arr: any = []
  chooseItemRef.value.forEach((el: any) => {
    arr.push(el.validate())
  })
  let res = await Promise.allSettled(arr)
  if (res.every((item: any) => item.value == true)) {
    return Promise.resolve(true)
  }
  return Promise.reject(false)
}

const clearValidate = () => {
  chooseItemRef.value?.forEach((el: any) => {
    el.clearValidate()
  })
}
//校验不通过商品
const validateDetailNum = () => {
  let checkList = []
  for (let i = 0; i < data.tableFromData.length; i++) {
    console.log(data.tableFromData[i].numChoose, data.tableFromData[i].numChoose)
    if (data.tableFromData[i].numChoose != data.tableFromData[i].deliverNum && data.tableFromData[i].numChoose != 0) {
      checkList.push({
        ...data.tableFromData[i]
      })
    }
  }
  return checkList
}
</script>
<template>
  <el-dialog v-bind="$attrs" title="发货" width="900px" @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="content">
      <!--发货列表 -->
      <div>
        <el-table :data="data.tableFromData" style="width: 100%">
          <YbtTableColumn prop="skuName" label="商品">
            <template #default="{ row }">{{ row.skuName + (row.spec || '') }}</template>
          </YbtTableColumn>
          <YbtTableColumn prop="skuCode" label="商品编码" />
          <YbtTableColumn prop="deliverNum" label="数量" />
          <YbtTableColumn prop="outgoingStatus" label="状态">
            <template #default="{ row }">{{ row.outgoingStatus == 1 ? '已发货' : '未发货' }}</template>
          </YbtTableColumn>
          <YbtTableColumn prop="numChoose" label="拟发货数量">
            <template #default="{ row }">
              <span :class="row.deliverNum != row.numChoose ? 'color-red' : ''">{{ row.numChoose }}</span>
            </template>
          </YbtTableColumn>
        </el-table>
      </div>
      <div class="mt-10">
        <el-form-item label="发货方式:" class="formItem" prop="expressCompanyCode" label-width="110px">
          <el-select clearable v-model="data.deliveryType" class="w-150">
            <el-option label="快递发货" value="1" />
            <el-option label="自行配送" value="2" />
          </el-select>
        </el-form-item>
      </div>
      <div>
        <ChooseItem ref="chooseItemRef" :deliveryType="data.deliveryType" v-for="(item, index) in data.chooseDetail"
          :index="index" :chooseDetail="data.chooseDetail" @addHandler="addHandler" @deleteHandler="deleteHandler"
          :detail="item"></ChooseItem>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="flex justify-start items-start">
          <span class="w-150px">用户收货信息：</span>
          <div>
            {{ data.userInfo.address }}
          </div>
        </div>
        <div class="min-w-170px">
          <el-button @click="handleClose" class="mr-10">取消</el-button>
          <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.content {
  max-height: 600px;
  overflow: auto;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>