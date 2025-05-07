<script setup lang="ts">
defineOptions({ name: 'Tooltip' })
interface IProp {
  title: string
  isTrueState: boolean
}
const props = withDefaults(defineProps<IProp>(), {
  title: '',
  isTrueState: false
})
</script>
<template>
  <div class="flex items-center justify-center">
    <div class="content" :style="isTrueState  ?{ 'background':'#f56c6c' }:{ 'background':'#67c23a' }">{{title}}</div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffff;
  background: #fff;
}
</style>