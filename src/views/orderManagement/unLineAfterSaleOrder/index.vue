<script setup lang="ts">
defineOptions({
  name: 'unLineAfterSaleOrder'
})
import after_order_api from '@/api/afterOrder/index'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import { tabsStore } from '@/stores'
import order_enum from '@/utils/constant/order'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
const $useRote = useRoute()

const tabsStoreInfo: any = tabsStore()

const formRef = ref<FormInstance>()
const cancelHandler = () => {
  goBarkOrderList()
}
const data = reactive({
  formData: {
    afterSaleType: '',
    reasonCode: '',
    reasonName: '',
    afterSaleNum: 1,
    reasonImages: '',
    reasonDescription: ''
  },
  detailInfo: {
    applyUserName: '',
    afterSaleAmount: '',
    applyUserMobile: '',
    channelOrderNo: '',
    reasonDescription: '',
    orgId: '',
    appId: ''
  },
  afterSaleGoods: [],
  submitLoading: false,
  formRules: {
    afterSaleType: [{ required: true, message: '请选择售后类型', trigger: 'change' }],
    reasonCode: [{ required: true, message: '请选择退款原因', trigger: 'change' }],
    images: [{ required: true, message: '上传凭证', trigger: 'change' }],
    reasonDescription: [{ required: true, message: '请选择退款原因', trigger: ['change', 'blur'] }]
  }
})
const saveHandler = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      data.submitLoading = true
      const { orgId, appId, channelOrderNo } = data.detailInfo
      const afterSaleGoodsList = data.afterSaleGoods
      let obj = { ...data.formData, orgId, appId, channelOrderNo, afterSaleGoodsList } as any
      after_order_api.A_backApply(obj).then((res: any) => {
        ElMessage.success('操作完成')
        goBarkOrderList()
      }).finally(() => {
        data.submitLoading = false
      })
    }
  })
}

const goBarkOrderList = () => {
  tabsStoreInfo.close($useRote, {
    path: '/orderManagement/order/index'
  })
}

const reasonForRefundList = computed(() => {
  return order_enum.reasonForRefundListObj[data.formData.afterSaleType]
})

onMounted(() => {
  getDetailInfo()
})

//获取详情
const getDetailInfo = () => {
  const { channelOrderNo, skuCode } = $useRote.query
  after_order_api.A_preAfterOrderDetail({ channelOrderNo, skuCode }).then((res: any) => {
    data.detailInfo = {
      ...data.detailInfo,
      ...res
    }
    data.afterSaleGoods = [{ ...res.afterSaleGoodsVO, afterSaleNum: res.afterSaleGoodsVO.goodsNum }]
  })
}
//退款总金额
const afterSaleAmount = computed(() => {
  const total = data.afterSaleGoods.reduce((total: any, curry: any) => {
    let retailPrice = getSystemOptionType.value == 401 ? curry.platformPurchasePrice : curry.retailPrice
    return (total += curry.afterSaleNum * retailPrice)
  }, 0)
  return total.toFixed(2)
})

const changeHandler = () => {
  data.formData.reasonCode = ''
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
        <span class="item_value">{{ data.detailInfo.applyUserName }}</span>
      </div>
      <div class="item">
        <span class="item_title">联系电话:</span>
        <span class="item_value">{{ data.detailInfo.applyUserMobile }}</span>
      </div>
      <div class="item">
        <span class="item_title">订单号:</span>
        <span class="item_value">{{ data.detailInfo.channelOrderNo }}</span>
      </div>
    </div>
  </CardModel>
  <CardModel title="基本信息">
    <div>
      <el-form ref="formRef" :model="data.formData" label-suffix=":" label-position="right" label-width="100px"
        :rules="data.formRules">
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
          <ImgUpload :limit="3" :maxSize="5" v-model="data.formData.reasonImages" :isArray="false"
            @verify="verifyHandler" :acceptList="['bmp', 'png', 'jpg', 'jpeg']"></ImgUpload>
        </el-form-item>
        <el-form-item label="说明" prop="reasonDescription">
          <el-input type="textarea" class="w-400" v-model="data.formData.reasonDescription" :rows="3" maxlength="200"
            show-word-limit placeholder="请输入说明" />
        </el-form-item>
      </el-form>
    </div>
  </CardModel>
  <CardModel title="商品信息">
    <el-table style="width: 100%" :data="data.afterSaleGoods">
      <YbtTableColumn prop="date" label="商品信息" width="300">
        <template #default="{ row }">
          <SkuDetail :customAttribute="{ url: 'images', name: 'skuName', id: 'skuCode' }" width="100%"
            :goodDetail="row"></SkuDetail>
        </template>
      </YbtTableColumn>
      <YbtTableColumn v-if="([10, 101, 20, 201].includes(getSystemOptionType.value))" prop="retailPrice" label="平台分销价">
        <template #default="{ row }">
          <span>{{ `￥${row.retailPrice}` }}</span>
        </template>
      </YbtTableColumn>
      <YbtTableColumn v-if="getSystemOptionType == 401" prop="platformPurchasePrice" label="含税供应价">
        <template #default="{ row }">
          <span>{{ `￥${row.platformPurchasePrice}` }}</span>
        </template>
      </YbtTableColumn>
      <YbtTableColumn prop="goodsNum" label="总量" />
      <YbtTableColumn prop="afterSaleNum" label="售后数量">
        <template #default="{ row }">
          <el-input-number v-model="row.afterSaleNum" :disabled="['3'].includes(data.formData.afterSaleType)" :min="1"
            :max="row.goodsNum" :precision="0" />
        </template>
      </YbtTableColumn>
      <YbtTableColumn v-if="![1, 2].includes(data.formData.afterSaleType)" prop="goodsNum" label="运费">
        <template #default="{ row }">
          <span>￥0</span>
        </template>
      </YbtTableColumn>
    </el-table>
  </CardModel>
  <CardModel>
    <div class="option">
      <el-button @click="cancelHandler">取消</el-button>
      <el-button type="primary" :loading="data.submitLoading" @click="saveHandler">提交</el-button>
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
