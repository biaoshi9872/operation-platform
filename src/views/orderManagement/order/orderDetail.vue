<script setup lang="ts">
import BaseOrderPage from './components/OrderPage/BaseOrderPage.vue'
import BonusOrderPage from './components/OrderPage/BonusOrderPage/index.vue'
import VoucherOrderPage from './components/OrderPage/VoucherOrderPage/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const source = computed(() => {
  return route.query.source
})
</script>
<template>
  <VoucherOrderPage v-if="source == '107'"></VoucherOrderPage>
  <BonusOrderPage v-else-if="source == '108'"></BonusOrderPage>
  <BaseOrderPage v-else></BaseOrderPage>
</template>

<style lang="scss" scoped></style>
