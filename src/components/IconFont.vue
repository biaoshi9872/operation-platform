<!-- components/IconFont.vue -->
<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${iconName}`" />
  </svg>
</template>
  
  <script setup>
defineProps({
  iconName: {
    type: String,
    required: true
  }
})
</script>
  
<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
  