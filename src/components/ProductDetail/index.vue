<script setup lang="ts">
defineOptions({
  name: 'ProductDetail'
})
import { A_getDetailView } from '@/api/commodityPool/index.ts'
import { A_queryByCategoryCode } from '@/api/proudectManger'
import CombineAttributeModule from './CombineAttributeModule.vue'
import { attributeTransition } from '@/views/commodity/commodityUtil'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import PriceShowModel from '../PriceModel/PriceShowModel.vue'

const { isCombinationGoods } = isStateCheckHooks()
const isShowAttr = computed(() => {
  if (dataPage?.goodDetail?.hasOwnProperty('comboType')) {
    return isCombinationGoods(dataPage?.goodDetail)
  } else {
    return false
  }
})
interface IProp {
  itemInfo: any
  selfProduct: any
  taxPurchaseCost: any
}

const props = withDefaults(defineProps<IProp>(), {
  itemInfo: {},
  selfProduct: true,
  taxPurchaseCost: ''
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'refresh'): void
}>()

const closedHandler = () => {
  emits('update:modelValue', false)
}

interface IData {
  goodDetail: {
    attributeName1: string
    attributeName2: string
    attributeValue1: string
    attributeValue2: string
    baseAttributeDto: any[]
    categoryCode: string
    categoryCodeName: string
    description: string
    images: string
    refundStatus: string
    taxPurchaseCost: number
    title: string
    unit: string
    unitName: string
  }
  attributeList: any[]
  baseFromItemList: any[]
}

const dataPage = reactive<IData>({
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
    unitName: ''
  },
  attributeList: [],
  baseFromItemList: []
})

const { goodDetail, baseFromItemList }: any = toRefs(dataPage)

const openHandler = () => {
  getProudestDetail()
}

//根据分类查询基础属性
const queryByCategoryCode = async () => {
  const { categoryCode, baseAttributeDto } = goodDetail.value as any
  const lastChildNode = categoryCode?.split('|')?.[2]
  const res = (await A_queryByCategoryCode({ categoryCode: lastChildNode })) as any
  if (res) {
    const { baseList } = res
    dataPage.attributeList = baseList as []
    baseFromItemList.value = attributeTransition(baseAttributeDto, baseList)
  }
}

const getProudestDetail = () => {
  const skuCode = props.itemInfo.skuCode
  A_getDetailView({ skuCode }).then((res: any) => {
    dataPage.goodDetail = {
      ...dataPage.goodDetail,
      ...res
    }
    queryByCategoryCode()
  })
}

const bannerImagesList = computed(() => {
  const bannerImages = dataPage.goodDetail?.bannerImages || []
  return bannerImages.concat([dataPage.goodDetail.images])
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
            <h5 class="mb-16">{{ goodDetail.title }} {{ goodDetail.attributeValue1 }} {{ goodDetail?.attributeValue2 }}</h5>
            <div class="mb-16">
              价格：
              <span class="color-red fs-24">
                <PriceShowModel :showPriceSymbol="true" :value="taxPurchaseCost ? taxPurchaseCost : goodDetail.taxPurchaseCost"></PriceShowModel>
              </span>
            </div>
            <div class="mb-16">
              销售单位：
              <span>{{ goodDetail.unitName }}</span>
            </div>
            <div class="mb-16" v-if="!isShowAttr">
              品牌:
              <span>{{ goodDetail.brandName }}</span>
            </div>
            <div class="mb-16">
              商品类别：
              <span>{{ goodDetail.categoryCodeName }}</span>
            </div>
            <CombineAttributeModule :goodDetail="goodDetail"></CombineAttributeModule>
            <div v-if="selfProduct">
              <div class="customary_container" v-for="(item, index) in dataPage.attributeList">
                <div class="customary_item mb-16">
                  <span class="title">{{ item.name }}:</span>
                  <span class="ml-8">{{ baseFromItemList?.['attributeName' + item.code] }}</span>
                </div>
              </div>
            </div>

            <div class="mb-16">
              温馨提示:
              <span>
                {{ goodDetail.refundStatus == '1' ? '支持' : '不支持'
                }}7天无理由退换货
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="summary" v-html="goodDetail.description" />
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
