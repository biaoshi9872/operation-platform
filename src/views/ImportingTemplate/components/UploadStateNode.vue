<script setup lang="ts">

interface IProp {
  nodeConfig: any
}
const props = withDefaults(defineProps<IProp>(), {
  nodeConfig: []
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

</script>

<template>
  <div class="order-state-container">
    <el-steps v-bind="$attrs" style="max-width: 700px" align-center>
      <el-step v-for="(item, index) in nodeConfig" :key="index" :title="item.title" />
    </el-steps>
  </div>
</template>

<style lang="scss" scoped>
.order-state-container {
  width: 100%;
  flex: 1;
  min-width: 700px;

}
</style>
