<template>
  <div class="revenue-card-container">
    <div class="header mb-6">
      <div class="title flex items-center">
        <el-icon class="refresh-icon mr-2" @click="queryFundBalance">
          <Refresh />
        </el-icon>
        <span>收入/支出分析 (元)</span>
      </div>
      <div class="filter-group">
        <div class="filter-btn" :class="{ active: dataPage.day === '1' }" @click="setDay('1')">昨日</div>
        <div class="filter-btn" :class="{ active: dataPage.day === '7' }" @click="setDay('7')">近7天</div>
        <div class="filter-btn" :class="{ active: dataPage.day === '30' }" @click="setDay('30')">近30天</div>
      </div>
    </div>

    <div class="revenue-content flex gap-6">
      <div class="info-card income-card flex-1">
        <div class="card-left">
          <div class="card-label">收入合计</div>
          <div class="card-amount">￥{{ dataPage.fundBalance.incrementData }}</div>
        </div>
        <div class="card-right">
          <el-icon class="trend-icon up">
            <TopRight />
          </el-icon>
        </div>
      </div>

      <div class="info-card expense-card flex-1">
        <div class="card-left">
          <div class="card-label">支出合计</div>
          <div class="card-amount">￥{{ dataPage.fundBalance.decrementData }}</div>
        </div>
        <div class="card-right">
          <el-icon class="trend-icon down">
            <BottomRight />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moneyManagement_api from '@/api/moneyManagement/index'

import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { Refresh, TopRight, BottomRight } from '@element-plus/icons-vue'

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

const setDay = (val: string) => {
  dataPage.day = val
  queryFundBalance()
}

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
  width: 100%;
  border-radius: 12px;
  background: #ffffff;
  padding: 30px;
  position: relative;
  box-shadow: 0 6px 18px rgba(31, 41, 55, 0.08);
  border: 1px solid #e6e8eb;
  color: #1f2d3d;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: bold;

      .refresh-icon {
        cursor: pointer;
        color: #4f46e5;
        transition: transform 1s;

        &:hover {
          transform: rotate(180deg);
        }
      }
    }

    .filter-group {
      display: flex;
      background: #f3f4f6;
      border-radius: 8px;
      padding: 4px;

      .filter-btn {
        padding: 6px 16px;
        font-size: 14px;
        color: #6b7280;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.3s;

        &:hover {
          color: #111827;
        }

        &.active {
          background: #6366f1;
          color: #ffffff;
          font-weight: 500;
        }
      }
    }
  }

  .revenue-content {
    .info-card {
      background: #ffffff;
      border: 1px solid #e6e8eb;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-2px);
      }

      .card-left {
        .card-label {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .card-amount {
          font-size: 36px;
          font-weight: bold;
          font-family: 'DIN Alternate', sans-serif;
        }
      }

      .card-right {
        .trend-icon {
          font-size: 24px;
        }
      }

      &.income-card {
        .card-amount {
          color: #059669;
        }

        .trend-icon {
          color: #059669;
        }
      }

      &.expense-card {
        .card-amount {
          color: #ef4444;
        }

        .trend-icon {
          color: #ef4444;
        }
      }
    }
  }
}
</style>
