<script setup lang="ts">

</script>
<template>
  <div class="loading-container">
    <div>
      <svg-icon class="loading" name="loading"></svg-icon>
    </div>
    <div class="ml-16">
      正在导入，请稍后...
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;

  .loading {
    font-size: 40px;
    animation: loading 1.5s infinite linear;
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }

    17% {
      transform: rotate(60deg);
    }

    34% {
      transform: rotate(120deg);
    }

    46% {
      transform: rotate(180deg);
    }

    70% {
      transform: rotate(240deg);
    }

    86% {
      transform: rotate(300deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>