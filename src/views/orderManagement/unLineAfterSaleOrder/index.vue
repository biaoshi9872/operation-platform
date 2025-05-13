<script setup lang="ts">
defineOptions({
  name: 'unLineAfterSaleOrder'
})
// import { A_applyAfterSaleSave, A_getApplyAfterSaleDetail } from '@/api/orderManger'
import order_enum from '@/utils/constant/order'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { tabsStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
const $useRote = useRoute()
const tabsStoreInfo: any = tabsStore()

const formRef = ref<FormInstance>()
const cancelHandler = () => {
  goBarkOrderList()
}

const saveHandler = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      const { formData } = data
      const { orderNo } = data.detailInfo
      const afterSaleGoods = {
        ...data.afterSaleGoods[0]
      }
      data.saveLoading = true
      // A_applyAfterSaleSave({ ...formData, orderNo, afterSaleGoods })
      //   .then((res: any) => {
      //     ElMessage.success('提交成功!')
      //     goBarkOrderList()
      //   })
      //   .finally(() => {
      //     data.saveLoading = false
      //   })
    }
  })
}

const goBarkOrderList = () => {
  tabsStoreInfo.reload({
    path: '/orderManagement/order/orderList',
    query: {}
  })
}



const reasonForRefundList = computed(() => {
  return order_enum.reasonForRefundListObj[data.formData.afterSaleType]
})

const data = reactive({
  formData: {
    orderNo: '',
    afterSaleType: '',
    reasonCode: '',
    reasonName: '',
    reasonDescription: '',
    images: ''
  },
  detailInfo: {
    buyer: '',
    afterSaleAmount: '',
    buyerPhone: '',
    orderNo: ''
  },
  afterSaleGoods: [],
  saveLoading: false,
  formRules: {
    afterSaleType: [{ required: true, message: '请选择售后类型', trigger: 'change' }],
    reasonCode: [{ required: true, message: '请选择退款原因', trigger: 'change' }],
    images: [{ required: true, message: '上传凭证', trigger: 'change' }],
    reasonDescription: [{ required: true, message: '请选择退款原因', trigger: ['change', 'blur'] }]
  }
})

onMounted(() => {
  getDetailInfo()
})

//获取详情
const getDetailInfo = () => {
  const { subOrderNo } = $useRote.query
  // A_getApplyAfterSaleDetail({ subOrderNo }).then((res: any) => {
  //   data.detailInfo = {
  //     ...data.detailInfo,
  //     ...res
  //   }
  //   data.afterSaleGoods = [
  //     {
  //       ...res,
  //       subOrderNo,
  //       afterSaleNum: res.skuGoodsNum
  //     }
  //   ]
  // })
}
//退款总金额
const afterSaleAmount = computed(() => {
  const total = data.afterSaleGoods.reduce((total: any, curry: any) => {
    return (total += curry.afterSaleNum * curry.skuSupplyPrice + curry.freightAmount)
  }, 0)
  return total.toFixed(2)
})

const changeHandler = () => {
  data.formData.reasonCode = ''
  data.afterSaleGoods.forEach((el: any) => {
    el.afterSaleNum = el.skuGoodsNum
  })
}
const reasonChangeHandler = (value: any) => {
  data.formData.reasonName = reasonForRefundList.value.find((item: any) => item.value == value)?.label
}

const verifyHandler = () => {
  formRef.value?.validateField('images')
}
</script>
<template>
  <CardModel title="基本信息">
    <div class="content_box">
      <div class="item">
        <span class="item_title">申请人:</span>
        <span class="item_value">{{ data.detailInfo.buyer }}</span>
      </div>
      <div class="item">
        <span class="item_title">联系电话:</span>
        <span class="item_value">{{ data.detailInfo.buyerPhone }}</span>
      </div>
      <div class="item">
        <span class="item_title">订单号:</span>
        <span class="item_value">{{ data.detailInfo.orderNo }}</span>
      </div>
    </div>
  </CardModel>
  <CardModel title="基本信息">
    <div>
      <el-form ref="formRef" :model="data.formData" label-suffix=":" label-position="right" label-width="100px" :rules="data.formRules">
        <el-form-item label="售后类型" prop="afterSaleType">
          <el-radio-group v-model="data.formData.afterSaleType" @change="changeHandler">
            <el-radio v-for="(item, index) in order_enum.AfterSalesType" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="['4', '3', '2'].includes(data.formData.afterSaleType)" label="退款总金额">
          <span>￥{{ afterSaleAmount }}</span>
        </el-form-item>
        <el-form-item label="退款原因" prop="reasonCode">
          <el-select v-model="data.formData.reasonCode" class="w-400" @change="reasonChangeHandler">
            <el-option v-for="(item, index) in reasonForRefundList" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传凭证">
          <ImgUpload
            :limit="3"
            :maxSize="5"
            v-model="data.formData.images"
            :isArray="false"
            @verify="verifyHandler"
            :acceptList="['bmp', 'png', 'jpg', 'jpeg']"
          ></ImgUpload>
        </el-form-item>
        <el-form-item label="说明" prop="reasonDescription">
          <el-input
            type="textarea"
            class="w-400"
            v-model="data.formData.reasonDescription"
            :rows="3"
            maxlength="200"
            show-word-limit
            placeholder="请输入说明"
          />
        </el-form-item>
      </el-form>
    </div>
  </CardModel>
  <CardModel title="商品信息">
    <el-table style="width: 100%" :data="data.afterSaleGoods">
      <YbtTableColumn prop="date" label="商品信息" width="300">
        <template #default="{ row }">
          <SkuDetail :customAttribute="{ url: 'skuImages', name: 'skuTitle', id: 'skuCode' }" width="100%" :goodDetail="row"></SkuDetail>
        </template>
      </YbtTableColumn>
      <!-- <YbtTableColumn prop="skuSupplyPrice" label="含税V链供应价">
        <template #default="{ row }">
          <span>{{ `￥${row.skuSupplyPrice}` }}</span>
        </template>
      </YbtTableColumn>-->
      <YbtTableColumn prop="skuGoodsNum" label="总量" />
      <YbtTableColumn prop="afterSaleNum" label="售后数量">
        <template #default="{ row }">
          <el-input-number
            v-model="row.afterSaleNum"
            :disabled="['3'].includes(data.formData.afterSaleType)"
            :min="1"
            :max="row.skuGoodsNum"
            :precision="0"
          />
        </template>
      </YbtTableColumn>
      <YbtTableColumn v-if="!['1'].includes(String(data.formData.afterSaleType))" prop="freightAmount" label="运费"></YbtTableColumn>
    </el-table>
  </CardModel>
  <CardModel>
    <div class="option">
      <el-button @click="cancelHandler">取消</el-button>
      <el-button type="primary" :loading="data.saveLoading" @click="saveHandler">提交</el-button>
    </div>
  </CardModel>
</template>
<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}

.option {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
