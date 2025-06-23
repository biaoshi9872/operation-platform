<script setup lang="ts">
import DepositApplicationCard from '../DepositApplicationCard.vue'
import RevenueAndExpenditureKanBanCard from '../RevenueAndExpenditureKanBanCard.vue'
import ApplyForATopUpRecordList from './ApplyForATopUpRecordList.vue'
import ConsumptionHistoryList from './ConsumptionHistoryList.vue'

interface IProp {
  active: string
}
const props = withDefaults(defineProps<IProp>(), {
  active: ''
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const dataPage: IPage<any, any> = reactive({
  facadeKz: {
    active: props.active
  }
})
</script>
<template>
  <PageContainer class="main_box">
    <div class="flex mb-8">
      <DepositApplicationCard></DepositApplicationCard>
      <RevenueAndExpenditureKanBanCard></RevenueAndExpenditureKanBanCard>
    </div>
    <div class="bg-#fff pb-8 pt-8 pr-8 pl-8">
      <el-tabs v-model="dataPage.facadeKz.active" class="demo-tabs">
        <el-tab-pane label="申请充值记录" name="0"></el-tab-pane>
        <el-tab-pane label="消费记录" name="1"></el-tab-pane>
      </el-tabs>
      <ApplyForATopUpRecordList v-if="dataPage.facadeKz.active === '0'"></ApplyForATopUpRecordList>
      <ConsumptionHistoryList v-if="dataPage.facadeKz.active === '1'"></ConsumptionHistoryList>
    </div>
  </PageContainer>
</template>
<style lang="scss" scoped></style>