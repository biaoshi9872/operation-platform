<script setup lang="ts">
import UpdateDeliverOrderDialog from './UpdateDeliverOrderDialog.vue';

interface IProp {
  deliverInfo?: any
  detail?: any
  orderType?: 0 | 1 //订单/售后订单
}
const props = withDefaults(defineProps<IProp>(), {
  deliverInfo: {},
  detail: {},
  orderType: 0
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
const showUpdateDeliver = ref(false)

const updateLogisticHandler = () => {
  showUpdateDeliver.value = true
}

//<!-- 京东 与售后物流不支持修改订单号 -->
const hiddenStatus = computed(() => {
  return props.orderType == 0 && ![0].includes(props.deliverInfo.flag)
})
</script>

<template>
  <div>
    <div class="header_container">
      <!-- 自配送 与 物流 -->
      <template v-if="deliverInfo.deliveryType == '1'">
        <span class="ml-8">物流信息:{{ deliverInfo.expressCompanyName }}</span> |
        <span>{{ deliverInfo.expressCode }}</span>
        <span v-if="hiddenStatus" class="ml-8">
          <AuthButton authKey="ORDER_UPDATA_WLDH" v-if="detail.channelSource == '105'" :detail="detail" type="text"
            @click="updateLogisticHandler">修改单号
          </AuthButton>
        </span>
      </template>
      <template v-else>
        <span class="ml-8">物流方式:自行配送</span> |
        <span class="ml-8">配送员手机号:{{ deliverInfo.mobile }}</span> |
        <span v-if="hiddenStatus" class="ml-8">
          <AuthButton authKey="ORDER_UPDATA_PSSJH" v-if="detail.channelSource == '105'" :detail="detail" type="text"
            @click="updateLogisticHandler">修改手机号
          </AuthButton>
        </span>
      </template>
    </div>
    <div class="content_box">
      <div class="content_box_left">
        <div class="mb-8 item" v-for="item in deliverInfo.deliverGoodsList">
          <SkuDetail :customAttribute="{ url: 'images', name: 'goodsName', id: 'skuCode' }" width="100%"
            showGiveawayTagBox="true" :goodDetail="item">
          </SkuDetail>
          <span>x{{ item.goodsNum }}</span>
        </div>
      </div>
      <div class="content_box_right">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in deliverInfo.trackList" placement="top" :key="index"
            :timestamp="activity.expressTime">{{ activity.optName }} | {{ activity.expressDetail }}</el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
  <UpdateDeliverOrderDialog v-model="showUpdateDeliver" :deliveryType="deliverInfo.deliveryType"
    :deliverInfo="deliverInfo"></UpdateDeliverOrderDialog>
</template>

<style lang="scss" scoped>
div {
  .header_container {
    .ml-8 {}

    span {}
  }

  .content_box {
    .content_box_left {
      .mb-8 {
        span {}
      }

      .item {}
    }

    .content_box_right {}
  }
}

.header_container {
  height: 42px;
  background-color: #dee9f7;
  line-height: 42px;
  text-indent: 10px;
  margin: 20px 0;
}

.content_box {
  display: flex;

  .content_box_left {
    background-color: var(--el-table-special-bg-color);
    padding: 16px;
    margin-right: 8px;
    max-width: 400px;

    .item {
      background-color: var(--el-searchForm-bg-color);
      padding: 8px;
      width: 300px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .content_box_right {
    width: 100%;
    background-color: var(--el-table-special-bg-color);
    padding: 16px;
  }
}
</style>
