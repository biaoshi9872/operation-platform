<template>
  <NewTallAfterSaleOrderPage v-if="type == '1'" />
  <AfterSaleOrderPage v-else />
</template>

<script setup lang="ts">
import NewTallAfterSaleOrderPage from './components/NewTallAfterSaleOrderPage.vue';
import AfterSaleOrderPage from './components/AfterSaleOrderPage.vue';
const $route = useRoute();
const type = ref('');
onMounted(() => {
  type.value = $route.query.type || '';
})
</script>

<style lang="scss" scoped></style>
