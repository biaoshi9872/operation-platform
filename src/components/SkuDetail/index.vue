<script setup lang="ts">
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import { split } from 'lodash-es'
const { isCombinationGoods } = isStateCheckHooks()
defineOptions({
  name: 'SkuDetail'
})

interface IProp {
  goodDetail: any
  dataList?: any
  showGiveawayTagBox?: boolean
  customAttribute: any
  curryPropInfo?: any
  showOnlyTitle?: boolean
  showBrandName?: boolean
  showExtraCode?: boolean
  width?: any
  comboNumName: string
  hasTag?: boolean
  isShowModelTag: boolean
  openTooltip: boolean
}

const props = withDefaults(defineProps<IProp>(), {
  goodDetail: {
    productPic: '',
    itemName: '',
    itemCode: '',
    brandName: ''
  },
  showExtraCode: false,
  hasTag: true,
  openTooltip: false,
  comboNumName: 'comboNum',
  dataList: [],
  showGiveawayTagBox: false,
  customAttribute: {
    url: 'images',
    name: 'title',
    id: ''
  },
  showOnlyTitle: false,
  showBrandName: true,
  isShowModelTag: true,
  width: '200px'
})
const emits = defineEmits<{
  (e: 'linkProduct', value: any): void
}>()
const dialogVisible = ref(false)
const attribute1TooltipShow = ref(false)
const attributeRef1 = ref(null)
const imagesSrc = computed(() => {
  let url = props.goodDetail[props.customAttribute.url]?.split(',')?.[0]
  return url ? `${url}?x-oss-process=image/resize,h_60,w_60` : ''
})

const bigImagesSrc = computed(() => {
  let url = props.goodDetail[props.customAttribute.url]?.split(',')?.[0]
  url = url?.replace('/n1/', '/n0/')
  return url
})

onMounted(() => {
  setTimeout(() => {
    attribute1TooltipShow.value = checkEllipsis(attributeRef1.value)
  }, 500)
})

const checkEllipsis = (el: any, lineNum: number = 1) => {
  try {
    let lineHeight = getComputedStyle(el)?.height?.replaceAll('px', '') as any
    let scrollHeight = el.scrollHeight
    return scrollHeight > lineHeight
  } catch (error) {
    return false
  }
}
const isShowTag = computed(() => {
  return isCombinationGoods(props.goodDetail)
})

const showTagBox = computed(() => {
  return (
    props.dataList &&
    props.dataList?.some((el: any) => {
      return isCombinationGoods(el)
    })
  )
})

const isShowGiveaway = computed(() => {
  return props.goodDetail.giveaway == '2' || props.goodDetail.isGift
})

const webkitLine = computed(() => {
  let line = 1
  if (!props.goodDetail[props.customAttribute.id]) {
    line++
  }
  if (!(props.showExtraCode && props.goodDetail.extraCode)) {
    line++
  }
  return line
})

const linkClickHandler = () => {
  emits('linkProduct', props.goodDetail)
}
</script>

<template>
  <div class="flex items-center" @dblclick="linkClickHandler">
    <template v-if="isShowModelTag">
      <!--是否组合-->
      <TagModel :showTag="isShowTag" :hasTag="hasTag" title="组"></TagModel>
      <!--是否组合-->
      <TagModel :showTag="isShowGiveaway" :hasTag="showGiveawayTagBox" title="赠"></TagModel>
    </template>
    <!-- 仅展示名称 -->
    <div v-if="showOnlyTitle">
      <el-tooltip class="item" effect="dark" :content="goodDetail[customAttribute.name]" placement="top">
        <template #content>
          <span v-if="!isShowTag">{{ goodDetail[customAttribute.name] }}</span>
          <div v-else>
            <AttributeModule :row="props.goodDetail" :comboNumName="comboNumName"></AttributeModule>
          </div>
        </template>
        <span>{{ goodDetail[customAttribute.name] }}</span>
      </el-tooltip>
    </div>
    <!-- 完整商品信息 -->
    <div v-else>
      <div class="sku-box" :style="{ width: width }">
        <el-image class="image" :src="imagesSrc" fit="contain" @click="dialogVisible = true"
          :alt="imagesSrc ? '加载失败' : '暂无图片'">
          <template #error>
            <div class="image-slot">{{ imagesSrc ? '加载失败' : '暂无图片' }}</div>
          </template>
        </el-image>
        <div class="title" :style="{ width: width }">
          <el-tooltip class="item" effect="dark" :content="goodDetail[customAttribute.name]" placement="top">
            <template v-if="openTooltip" #content>
              <div class="good-name-box" v-if="!isShowTag">{{ goodDetail[customAttribute.name] }}</div>
              <div v-else>
                <AttributeModule :row="props.goodDetail" :comboNumName="comboNumName"></AttributeModule>
              </div>
            </template>
            <div class="good-name-box">{{ goodDetail[customAttribute.name] }}</div>
          </el-tooltip>
          <div>
            <div class="color-#999 mt-4 tooltip" v-if="goodDetail[customAttribute.id]">
              商品编码:
              <el-tooltip class="item" effect="dark" :content="goodDetail[customAttribute.id]" placement="top">{{
                goodDetail[customAttribute.id] }}</el-tooltip>
            </div>
            <div class="color-#999 mt-4 tooltip" v-if="showExtraCode">
              商品辅助码:
              <el-tooltip class="item" effect="dark" :content="goodDetail.extraCode" placement="top">{{
                goodDetail.extraCode
                || '-' }}</el-tooltip>
            </div>
          </div>
        </div>
        <!-- 实现预览 -->
        <el-dialog v-model="dialogVisible" :append-to-body="true">
          <img w-full :src="bigImagesSrc" :alt="bigImagesSrc ? '加载失败' : '暂无图片'" />
        </el-dialog>
      </div>
      <div v-if="showBrandName && goodDetail.brandName" class="color-#999 mt-4 brandBox">
        <div class="content w-160" ref="attributeRef1">
          品牌：
          <el-tooltip class="item" effect="dark" :content="goodDetail.brandName" :disabled="!attribute1TooltipShow"
            placement="top">
            <span class="fs-12">{{ goodDetail.brandName || '测试' }}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sku-box {
  @include flex('start');

  .image {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    object-fit: contain;

    // z-index: 9988;
    .image-slot {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f7fa;
      color: #909399;
    }
  }

  .sku-detail {
    margin-left: 8px;
    flex: 1;
  }

  .title {
    margin: 8px;
    padding-right: 8px;
  }

  .good-name-box {
    @include overflow(v-bind(webkitLine));
  }
}

.brandBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .content {
    color: var(--el-color-primary-light-3);
    border-radius: 4px;
    background-color: var(--el-color-primary-light-9);
    padding: 2px 8px;
    @include overflow(1);
  }
}
</style>
