<script setup lang="ts">
defineOptions({
  name: 'ProductDetail'
})
import bonusModel_api from '@/api/bonusModel/index'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import goodPool_enum from '@/utils/constant/goodPoor'
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
    "couponId": "2001586037526704129",
    "couponName": "虚拟礼包直连",
    "faceValue": 0.1,
    "couponType": 4,
    "status": 1,
    "useDescription": "123",
    "platform": 1,
    "pushStatus": 1,
    "supplyPrice": 0.2,
    "stock": 0,
    "expireDateMin": null,
    "expireDateMax": null
  },
  attributeList: [],
  baseFromItemList: [],
  loading: false
})
const openHandler = () => {
  getProudestDetail()
}
const getProudestDetail = () => {
  const couponId = props.itemInfo.couponId
  dataPage.loading = true
  const api = bonusModel_api.A_getDetail
  api({ couponId }).then((res: any) => {
    dataPage.goodDetail = {
      ...dataPage.goodDetail,
      ...res
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
  return ['https://ybt-vsc.oss-cn-hangzhou.aliyuncs.com/images/20260116/130b6384cf2c48a88e04e81e77905b0f.jpg']
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
            <h3 class="mb-16">{{ dataPage.goodDetail.couponName }}
            </h3>
            <div class="mb-16" v-if="!isFromOrgLast">
              平台成本：
              <span class="color-red ">
                <PriceShowModel :showPriceSymbol="true" :value="dataPage.goodDetail.supplyPrice"></PriceShowModel>
              </span>
            </div>
            <div class="mb-16">
              市场价：
              <span class="color-red ">
                <PriceShowModel :showPriceSymbol="true" :value="dataPage.goodDetail.faceValue"></PriceShowModel>
              </span>
            </div>
            <div class="mb-16">
              商品分类：
              <span>{{ dataPage.goodDetail.couponTypeName }}</span>
            </div>
            <div class="mb-16">
              商品来源：
              <span>立减金</span>
            </div>
          </div>
        </div>
      </div>
      <div class="summary" v-html="dataPage.goodDetail.useDescription" />
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
