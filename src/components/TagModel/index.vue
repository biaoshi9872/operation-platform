<script setup lang="ts">
defineOptions({ name: 'TagModel' })
interface IProp {
  title: any
  showTag: boolean
  hasTag: boolean
}
const props = withDefaults(defineProps<IProp>(), {
  showTag: true,
  hasTag: false,
  title: ''
})
</script>
<template>
  <div class="flex items-center justify-start">
    <span class="state_container">
      <div v-if="hasTag && showTag" class="state_cell">
        <span v-if="showTag" class="title">{{ title }}</span>
      </div>

    </span>
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.state_container {
  flex: 1;
  height: 100%;
  margin-right: 4px;
  display: inline-block;
  box-sizing: border-box;

  .state_cell {
    width: 18px;
    height: 18px;

    display: flex;
    justify-content: center;
    align-content: center;
  }

  .title {
    width: 100%;
    height: 100%;
    border-radius: 3px;
    box-sizing: border-box;
    padding: 3px;
    font-size: 13px;
    background: red;
    line-height: 14px;
    text-align: center;
    color: #fff;
  }
}
</style>