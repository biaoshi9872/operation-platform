<script setup lang="ts">
defineOptions({
  name: 'ProductDetail'
})
import goodPood_api from '@/api/goodPool/index'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import goodPool_enum from '@/utils/constant/goodPoor'
import { detailTransfer } from './BaseUtils'
import PriceShowModel from '@/components/PriceModel/PriceShowModel.vue'
const { isFromOrgLast } = isStateCheckHooks()

interface IProp {
  itemInfo?: any
  productSource?: string
  show?: boolean
  type: string
}

const props = withDefaults(defineProps<IProp>(), {
  itemInfo: {},
  productSource: '',
  show: false,
  type: 'api'
})

const emits = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'refresh'): void
}>()

const closedHandler = () => {
  emits('update:show', false)
}

interface IData {
  goodDetail: any
  attributeList: any[]
  baseFromItemList: any[]
}

const dataPage = reactive<any>({
  goodDetail: {
    attributeName1: '',
    attributeName2: '',
    attributeValue1: '',
    attributeValue2: '',
    baseAttributeDto: [],
    categoryCode: '',
    categoryCodeName: '',
    description: '',
    images: '',
    refundStatus: '',
    taxPurchaseCost: null,
    title: '',
    unit: '',
    unitName: '',
    goodsBaseAttributeList: [],
    bannerImages: [],
    platformSupplyPrice: '',
    platformCost: '',
    markPrice: ''
  },
  attributeList: [],
  baseFromItemList: [],
  loading: false
})
const openHandler = () => {
  getProudestDetail()
}
const getProudestDetail = () => {
  const skuCode = props.itemInfo.couponId
  const goodsSourceType = props.productSource
  dataPage.loading = true
  const api = goodPood_api.A_details
  api({ skuCode, goodsSourceType, ...props.itemInfo }).then((res: any) => {
    let obj = detailTransfer(res, goodsSourceType)
    dataPage.goodDetail = {
      ...dataPage.goodDetail,
      ...obj
    }
    emits('update:show', true)
  }).catch(() => {
    emits('update:show', false)
  }).finally(() => {
    dataPage.loading = false
  })
}
//轮播图片
const bannerImagesList = computed(() => {
  let bannerImages = dataPage.goodDetail?.bannerImages || []
  let list = bannerImages
  if (dataPage.goodDetail.images) {
    let arr = [dataPage.goodDetail.images]
    list = bannerImages.concat(arr)
  }
  return list
})

const value = computed({
  get() {
    return props.show
  },
  set(val) {
    emits('update:show', val)
  }
})

</script>
<template>
  <el-drawer v-model="value" title="商品详情" :size="750" @open="openHandler" :before-close="closedHandler"
    :append-to-body="true">
    <div v-loading="dataPage.loading" class="goodInfo_box">
      <div class="content">
        <div class="left">
          <el-carousel v-if="bannerImagesList.length">
            <el-carousel-item v-for="item in bannerImagesList" :key="item">
              <div class="img_box">
                <el-image class="image" :src="item"></el-image>
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="no_img" v-else>
            暂无图片
          </div>
        </div>
        <div class="right">
          <div>
            <h5 class="mb-16">{{ dataPage.goodDetail.title }} {{ dataPage.goodDetail.attributeValue1 }} {{
              dataPage.goodDetail?.attributeValue2 }}
            </h5>
            <div class="mb-16" v-if="!isFromOrgLast">
              平台成本：
              <span class="color-red ">
                <PriceShowModel :showPriceSymbol="true" :value="dataPage.goodDetail.platformCost"></PriceShowModel>
              </span>
            </div>
            <div class="mb-16">
              平台供应价：
              <span class="color-red ">
                <PriceShowModel :showPriceSymbol="true" :value="dataPage.goodDetail.platformSupplyPrice">
                </PriceShowModel>
              </span>
            </div>
            <div v-if="type == 'myPool'" class="mb-16">
              分销价：
              <span class="color-red ">
                <PriceShowModel :showPriceSymbol="true" :value="dataPage.goodDetail.retailPrice">
                </PriceShowModel>
              </span>
            </div>
            <div class="mb-16">
              市场价：
              <span class="color-red ">
                <PriceShowModel :showPriceSymbol="true" :value="dataPage.goodDetail.markPrice"></PriceShowModel>
              </span>
            </div>
            <div class="mb-16">
              商品分类：
              <span>{{ dataPage.goodDetail.categoryCodeName }}</span>
            </div>
            <div class="mb-16">
              商品来源：
              <span>{{ goodPool_enum.getSourceTypeNameByKey(dataPage.goodDetail.source) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="summary" v-html="dataPage.goodDetail.description" />
    </div>
  </el-drawer>
</template>
<style lang="scss" scoped>
.goodInfo_box {
  box-sizing: border-box;
  overflow: auto;

  .content {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    background-color: var(--el-searchForm-bg-color);
    min-height: 300px;

    .left {
      flex: 1;

      .img_box {
        padding: 8px;
        background: var(--el-table-special-bg-color);
        width: 100%;
        height: 100%;

        .image {
          width: 100%;
          height: 100%;
        }
      }

      .no_img {
        height: 300px;
        line-height: 300px;
        text-align: center;
        background: var(--el-table-special-bg-color);
        color: #333;
        font-size: 24rpx;
      }
    }

    .right {
      flex: 1;
    }
  }

  .summary {
    background-color: var(--el-searchForm-bg-color);
  }

  .coupon_list {
    display: inline-flex;
    flex-direction: column;
    gap: 12px;
    flex-wrap: wrap;
  }
}
</style>
