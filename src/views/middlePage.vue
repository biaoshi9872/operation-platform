<template>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const $router = useRouter()
const $route = useRoute()

onMounted(() => {
  const { pathInfo } = $route.query as any
  let path = JSON.parse(pathInfo).path
  let query = JSON.parse(pathInfo).query
  $router.push({ path, query })
})
</script>

<style lang="scss" scoped></style>
