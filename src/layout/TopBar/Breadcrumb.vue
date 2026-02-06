<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { computed } from 'vue'

const route = useRoute()
const breadcrumb = computed(() => route.meta.breadcrumb as any[])
</script>

<template>
  <div class="brand-title">
    <el-breadcrumb separator=">" class="navbar-breadcrumb">
      <el-breadcrumb-item key="home">
        <span>首页</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
        <span :class="index == breadcrumb?.length - 1 ? 'last-tag' : ''">{{ breadcrumb?.length - 1 ? route.query.tabTitle
          || item : item }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss">
.navbar-breadcrumb {
  padding-left: 10px;
  font-size: 16px;
}
</style>
