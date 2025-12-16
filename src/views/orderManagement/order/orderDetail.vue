<script setup lang="ts">
import BaseOrderPage from './components/OrderPage/BaseOrderPage.vue'
import VoucherOrderPage from './components/OrderPage/VoucherOrderPage/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const source = computed(() => {
  return route.query.source
})
</script>
<template>
  <VoucherOrderPage v-if="source == '107'"></VoucherOrderPage>
  <BaseOrderPage v-else></BaseOrderPage>
</template>

<style lang="scss" scoped></style>
