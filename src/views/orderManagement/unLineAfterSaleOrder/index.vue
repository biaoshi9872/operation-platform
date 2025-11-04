<template>
  <NewTallAfterSaleOrderPage v-if="type == '1'" @refresh="refresh" />
  <AfterSaleOrderPage v-else @refresh="refresh" />
</template>

<script setup lang="ts">
import NewTallAfterSaleOrderPage from './components/NewTallAfterSaleOrderPage.vue';
import AfterSaleOrderPage from './components/AfterSaleOrderPage.vue';
import eventBus from '@/utils/eventBus';
const $route = useRoute();
const type = ref('');
onMounted(() => {
  type.value = $route.query.type || '';
})
const refresh = () => {
  eventBus.emit('orderRefresh');
}
</script>

<style lang="scss" scoped></style>
