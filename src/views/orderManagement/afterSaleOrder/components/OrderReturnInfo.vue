<script setup lang="ts">
const route = useRoute()
interface IProp {
  orderInfo?: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const dataPage = reactive({
  returnInfo: {
    name: '',
    provinceId: '',
    cityId: '',
    countyId: '',
    townId: '',
    address: '',
    mobile: ''
  }
})

onMounted(() => {
  getOrderReturnInfo()
})

const afterSaleTypeName = inject('afterSaleTypeName', () => '')

const getOrderReturnInfo = () => {
  const { afterSaleOrderNo } = route.query
  // A_queryAfterSaleAddress({ afterSaleOrderNo, type: 1 }).then((res: any) => {
  //   dataPage.returnInfo = {
  //     ...dataPage.returnInfo,
  //     ...res
  //   }
  // })
}
</script>

<template>
  <div class="content_box">
    <div class="item">
      <span class="item_title">联系人:</span>
      <span class="item_value">{{ dataPage.returnInfo.name }}</span>
    </div>
    <div class="item">
      <span class="item_title">联系电话:</span>
      <span class="item_value">{{ dataPage.returnInfo.mobile }}</span>
    </div>
    <div class="item">
      <span class="item_title">{{ afterSaleTypeName }}地址:</span>
      <span class="item_value">
        <AddressInfo
          :address="dataPage.returnInfo.address"
          :provinceId="dataPage.returnInfo.provinceId"
          :cityId="dataPage.returnInfo.cityId"
          :countyId="dataPage.returnInfo.countyId"
          :townId="dataPage.returnInfo.townId"
        ></AddressInfo>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}
</style>
