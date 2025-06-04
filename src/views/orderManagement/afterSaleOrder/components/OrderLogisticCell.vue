<script setup lang="ts">
import LogisticCell from '../../components/LogisticCell.vue';

const route = useRoute()
interface IProp {
  orderInfo?: any
  orderDeliverVOList?: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderInfo: {},
  orderDeliverVOList: []
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const activeName = ref(0)

</script>

<template>
  <CardModel v-if="orderDeliverVOList.length" title="供应商发货信息">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`包裹${index + 1}`" :name="index" v-for="(item, index) in orderDeliverVOList">
          <LogisticCell :deliverInfo="item" :orderType="1"></LogisticCell>
        </el-tab-pane>
      </el-tabs>
    </div>
  </CardModel>
</template>

<style lang="scss" scoped></style>
