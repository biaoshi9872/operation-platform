<script setup lang="ts">
import OrgList from './components/OrgList.vue'
import Application from './components/Application.vue'
</script>
<template>
  <div class="org-container">
    <OrgList></OrgList>
    <Application></Application>
  </div>
</template>
<style lang="scss" scoped>
.org-container {
  display: flex;
  gap: 12px;
  min-height: calc(100vh - 50px);
}
</style>