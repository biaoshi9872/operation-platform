<script setup lang="ts">
defineOptions({
  name: 'ProductDetail'
})
import goodPood_api from '@/api/goodPool/index'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import goodPool_enum from '@/utils/constant/goodPoor'
import PriceShowModel from '../PriceModel/PriceShowModel.vue'
import { detailTransfer } from './BaseUtils'
import CombineAttributeModule from './CombineAttributeModule.vue'
const { isCombinationGoods, isFromOrgLast } = isStateCheckHooks()
const isShowAttr = computed(() => {
  if (dataPage?.goodDetail?.hasOwnProperty('comboType')) {
    return isCombinationGoods(dataPage?.goodDetail)
  } else {
    return false
  }
})
interface IProp {
  itemInfo?: any
  productSource?: string
}

const props = withDefaults(defineProps<IProp>(), {
  itemInfo: {},
  productSource: ''
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'refresh'): void
}>()

const closedHandler = () => {
  emits('update:modelValue', false)
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
  baseFromItemList: []
})
const openHandler = () => {
  getProudestDetail()
}
const getProudestDetail = () => {
  const skuCode = props.itemInfo.skuCode
  const goodsSourceType = props.productSource
  goodPood_api.A_details({ skuCode, goodsSourceType }).then((res: any) => {
    let obj = detailTransfer(res, goodsSourceType)
    dataPage.goodDetail = {
      ...dataPage.goodDetail,
      ...obj
    }
  })
}
//轮播图片
const bannerImagesList = computed(() => {
  const bannerImages = dataPage.goodDetail?.bannerImages || []
  if (dataPage.goodDetail.image) {
    bannerImages.concat([dataPage.goodDetail.images])
  }
  return bannerImages
})
</script>
<template>
  <el-drawer v-bind="$attrs" title="商品详情" :size="750" @open="openHandler" :before-close="closedHandler">
    <div class="goodInfo_box">
      <div class="content">
        <div class="left">
          <el-carousel>
            <el-carousel-item v-for="item in bannerImagesList" :key="item">
              <div class="img_box">
                <el-image :src="item"></el-image>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="right">
          <div>
            <h5 class="mb-16">{{ dataPage.goodDetail.title }} {{ dataPage.goodDetail.attributeValue1 }} {{
              dataPage.goodDetail?.attributeValue2 }}
            </h5>
            <CombineAttributeModule :goodDetail="dataPage.goodDetail"></CombineAttributeModule>
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
            <div class="mb-16">
              市场价：
              <span class="color-red ">
                <PriceShowModel :showPriceSymbol="true" :value="dataPage.goodDetail.markPrice"></PriceShowModel>
              </span>
            </div>
            <div class="mb-16" v-if="!isShowAttr">
              品牌:
              <span>{{ dataPage.goodDetail.brandName }}</span>
            </div>
            <div class="mb-16">
              商品分类：
              <span>{{ dataPage.goodDetail.categoryCodeName }}</span>
            </div>
            <div class="mb-16">
              销售单位：
              <span>{{ dataPage.goodDetail.unitName }}</span>
            </div>
            <div class="mb-16">
              商品来源：
              <span>{{ goodPool_enum.getSourceTypeNameByKey(dataPage.goodDetail.source) }}</span>
            </div>
            <div class="mb-16">
              温馨提示:
              <span>
                {{ dataPage.goodDetail.refundStatus == '1' ? '支持' : '不支持'
                }}7天无理由退换货
              </span>
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
      }
    }

    .right {
      flex: 1;
    }
  }

  .summary {
    background-color: var(--el-searchForm-bg-color);
  }
}
</style>
