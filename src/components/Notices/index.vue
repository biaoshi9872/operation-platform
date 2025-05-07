
<script setup lang="ts">
defineOptions({
  name: 'Notices'
})
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
<template #option>
  <div class="notices-container">
    <div class="notices-content">
      <div class="prefix-icon">
        <svg-icon name="notices" class="prefix-icon" />
      </div>
      <div class="title">{{ title }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.notices-container {
  display: inline-block;
  margin-left: 24px;
  .prefix-icon {
    font-size: 20px;
    color: var(--el-color-primary);
  }
  .notices-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    color: #666666;
  }
  .title {
    animation: notice 1s infinite;
  }
  @keyframes notice {
  }
}
</style>
