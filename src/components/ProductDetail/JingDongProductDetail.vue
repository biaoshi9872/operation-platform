<script setup lang="ts">
defineOptions({
  name: 'JingDongProductDetail'
})
import { A_getJdProductDetail, A_getDetailView } from '@/api/commodityPool/index.ts'

interface IProp {
  itemInfo: any
}

const props = withDefaults(defineProps<IProp>(), {
  itemInfo: {
    type: Object,
    default: () => {}
  }
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
}

const dataPage = reactive<IData>({
  goodDetail: {}
})

const { goodDetail } = toRefs(dataPage) as any

const openHandler = () => {
  getProudestDetail()
}

const getProudestDetail = () => {
  const itemCode = props.itemInfo.itemCode || props.itemInfo.skuCode
  A_getJdProductDetail({ itemCode }).then((res: any) => {
    dataPage.goodDetail = {
      ...dataPage.goodDetail,
      ...res.productDetail
    }
  })
}

const bannerImagesList = computed(() => {
  const bannerImages = dataPage.goodDetail?.bannerImages || []
  return bannerImages.concat([goodDetail.value.photoUrl || goodDetail.value.image || ''])
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
            <h3 class="mb-16">{{ goodDetail.itemName }}</h3>
            <div class="mb-16">
              渠道V链供应价：
              <span class="color-red fs-24">
                ￥{{ goodDetail.supplyPrice
                }}
              </span>
            </div>
            <div class="mb-16">
              市场价：
              <span class="color-red fs-24">
                ￥{{ goodDetail.markPrice
                }}
              </span>
            </div>
            <div class="mb-16">
              分类
              <span>{{ goodDetail.itemCateName || goodDetail.catName }}</span>
            </div>
            <div class="mb-16">
              供应商：
              <span>{{ goodDetail.supplyName }}</span>
            </div>
            <div class="mb-16">
              品牌:
              <span>{{ goodDetail.brandName }}</span>
            </div>
            <div class="mb-16">
              商品编码：
              <span>{{ goodDetail.itemCode }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="summary" v-html="goodDetail.content" />
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