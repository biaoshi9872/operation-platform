<script setup lang="ts">
import LogisticCell from '../../components/LogisticCell.vue';
interface IProp {
  orderDeliverVOList: any
  orderInfo: any
  active: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderDeliverVOList: [],
  orderInfo: {}
})
const emits = defineEmits<{
  (e: 'update:active', value: any): void
}>()

const value = computed({
  get() {
    return props.active
  },
  set(val) {
    emits('update:active', val)
  }
})
</script>

<template>
  <div>
    <el-tabs v-if="orderDeliverVOList.length" v-model="value">
      <el-tab-pane :label="`包裹${index + 1}`" :name="index" v-for="(item, index) in orderDeliverVOList">
        <LogisticCell :deliverInfo="item" :detail="orderInfo"></LogisticCell>
      </el-tab-pane>
    </el-tabs>
    <div v-else>暂无物流信息</div>
  </div>
</template>

<style lang="scss" scoped></style>
