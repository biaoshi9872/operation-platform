<template>
  <div class="revenue-card-container ml-8">
    <div class="flex items-center justify-between mb-20">
      <div><svg-icon icon-name="zhiChu" name="zhiChu" class="fs-18 mr-4"></svg-icon>收入/支出(元)</div>
      <div>
        <el-radio-group v-model="dataPage.day" @change="queryFundBalance">
          <el-radio-button value="1" label="1">昨日</el-radio-button>
          <el-radio-button value="7" label="7">近7天</el-radio-button>
          <el-radio-button value="30" label="30">近30天</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="revenue-content">
      <div>
        <div>￥<span class="fs-28">{{ dataPage.fundBalance.incrementData }}</span></div>
        <div>收入</div>
      </div>
      <div>
        <div>￥<span class="fs-28">{{ dataPage.fundBalance.decrementData }}</span></div>
        <div>支出</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moneyManagement_api from '@/api/moneyManagement/index'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { userInfo } = storeToRefs(useUserStore())
const dataPage = reactive({
  day: '1',
  fundBalance: {
    incrementData: 0,
    decrementData: 0
  }
})

onMounted(() => {
  queryFundBalance()
})

//获取资金
const queryFundBalance = async () => {
  queryIncrement()
  queryDecrement()
}
//
const queryIncrement = () => {
  const { day } = dataPage
  const { orgId } = userInfo.value as any
  moneyManagement_api.A_queryIncrement({ day, orgId }).then((res: any) => {
    dataPage.fundBalance.incrementData = res
  })
}
//
const queryDecrement = () => {
  const { day } = dataPage
  const { orgId } = userInfo.value as any
  moneyManagement_api.A_queryDecrement({ day, orgId }).then((res: any) => {
    dataPage.fundBalance.decrementData = res
  })
}

</script>

<style lang="scss" scoped>
.revenue-card-container {
  flex: 2;
  border-radius: 10px;
  background: var(--el-searchForm-bg-color);
  padding: 20px 40px 20px 40px;
  position: relative;

  .revenue-content {
    align-items: center;
    display: flex;
    justify-content: space-between;

    >div {
      flex: 1 1 auto;
      text-align: center;
    }

    >div:first-child {
      border-right: 1px solid #E6E6E6;
    }
  }
}
</style>
