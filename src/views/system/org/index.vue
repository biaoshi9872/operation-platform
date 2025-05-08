<script setup lang="ts">
import OrgList from './components/OrgList.vue'
import Application from './components/Application.vue'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { isOrgLast, orgInfo } = isStateCheckHooks()

const dataPage = reactive({
  curryOrgInfo: {},
  type: 'edit'
})
onMounted(() => {
  dataPage.curryOrgInfo = isOrgLast ? orgInfo.value : {}
})
</script>
<template>
  <div class="org-container">
    <OrgList v-if="!isOrgLast" v-model:curryOrgInfo="dataPage.curryOrgInfo" v-model="dataPage.type"></OrgList>
    <Application v-model:curryOrgInfo="dataPage.curryOrgInfo" :type="dataPage.type"></Application>
  </div>
</template>
<style lang="scss" scoped>
.org-container {
  display: flex;
  gap: 12px;
  min-height: calc(100vh - 50px);
}
</style>