<script setup lang="ts">
defineOptions({
  name: 'PriceShowModel'
})
import MyDecimal from '@/utils/decimal'
import useCacheHooks from '@/hooks/cacheHooks'
const { getSystemConfigInfoByKey } = useCacheHooks()
let SYS_PRICE_DIGIT = ref(2)
let SYS_PERCENT_DIGIT = ref(2)
onMounted(() => {
  getSystemConfigInfoByKey('SYS_PRICE_DIGIT').then(res => {
    SYS_PRICE_DIGIT.value = Number.parseInt(res?.paramValue || 2)
  })
  getSystemConfigInfoByKey('SYS_PERCENT_DIGIT').then(res => {
    SYS_PERCENT_DIGIT.value = Number.parseInt(res?.paramValue || 2)
  })
})

interface IProp {
  value: string
  type?: 'price' | 'percent'
  showPriceSymbol?: boolean
  showPercentSymbol?: boolean
}
const props = withDefaults(defineProps<IProp>(), {
  value: '',
  type: 'price',
  showPriceSymbol: false,
  showPercentSymbol: false
})
const showPriceValue = computed(() => {
  if (props.value == 0) {
    return props.value
  }
  let value: any = ''
  if (props.type === 'percent') {
    value = new MyDecimal(props.value || 0).toFormat(SYS_PERCENT_DIGIT.value)
  } else {
    value = new MyDecimal(props.value || 0).toFormat(SYS_PRICE_DIGIT.value)
  }
  return value == '0.00' ? '-' : value
})
</script>
<template>
  <div class="inline-block">
    <span v-if="showPriceSymbol && showPriceValue!='-'">¥</span>
    {{showPriceValue}}
    <span v-if="showPercentSymbol && showPriceValue!='-'">%</span>
  </div>
</template>
<style lang="scss" scoped>
</style>